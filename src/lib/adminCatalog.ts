import { supabase } from './roles';

export type AdminCatalogSnapshot={products:any[];establishments:any[];coverageGaps:any[]};
export type AdminCatalogOverview={productCount:number;establishmentCount:number;verifiedCount:number;demoCount:number;establishments:any[]};
const TTL=45_000;
let catalogCache:{value:AdminCatalogSnapshot;at:number}|null=null;
let catalogRequest:Promise<AdminCatalogSnapshot>|null=null;
let overviewCache:{value:AdminCatalogOverview;at:number}|null=null;
const storeCache=new Map<string,{value:any[];at:number}>();
export function invalidateAdminCatalog(){catalogCache=null;overviewCache=null;storeCache.clear();}
export async function loadAdminCatalog(force=false,full?:boolean):Promise<AdminCatalogSnapshot>{
 if(!supabase)return{products:[],establishments:[],coverageGaps:[]};
 const wantsFull=full??(typeof window!=='undefined'&&window.location.pathname.startsWith('/admin/catalogo'));
 if(!wantsFull){const o=await loadAdminCatalogOverview(force);return{products:[],establishments:o.establishments||[],coverageGaps:[]};}
 if(!force&&catalogCache&&Date.now()-catalogCache.at<TTL)return catalogCache.value;
 if(!force&&catalogRequest)return catalogRequest;
 catalogRequest=(async()=>{const{data,error}=await supabase.rpc('admin_catalog_snapshot');if(error)throw error;const value=(data||{products:[],establishments:[],coverageGaps:[]}) as AdminCatalogSnapshot;catalogCache={value,at:Date.now()};return value;})();
 try{return await catalogRequest;}finally{catalogRequest=null;}
}
export async function loadAdminCatalogOverview(force=false):Promise<AdminCatalogOverview>{
 if(!supabase)return{productCount:0,establishmentCount:0,verifiedCount:0,demoCount:0,establishments:[]};
 if(!force&&overviewCache&&Date.now()-overviewCache.at<TTL)return overviewCache.value;
 const{data,error}=await supabase.rpc('admin_catalog_overview');if(error)throw error;const value=(data||{}) as AdminCatalogOverview;overviewCache={value,at:Date.now()};return value;
}
export async function loadAdminEstablishmentCatalog(establishmentId:string,force=false):Promise<any[]>{
 if(!supabase)return[];const cached=storeCache.get(establishmentId);if(!force&&cached&&Date.now()-cached.at<TTL)return cached.value;
 const{data,error}=await supabase.rpc('admin_establishment_catalog',{_establishment_id:establishmentId});if(error)throw error;const value=Array.isArray(data)?data:[];storeCache.set(establishmentId,{value,at:Date.now()});return value;
}
async function rpcMutation(name:string,args:any){if(!supabase)return{data:null,error:'Supabase indisponível'};const{data,error}=await supabase.rpc(name,args);if(!error)invalidateAdminCatalog();return{data,error:error?.message??null};}
export async function saveAdminProduct(input:{id?:string|null;name:string;brand?:string;manufacturer?:string;category?:string;size?:string;unit?:string;barcode?:string;slug?:string;imageUrl?:string}){const r=await rpcMutation('admin_save_product',{_id:input.id||null,_name:input.name,_brand:input.brand||null,_manufacturer:input.manufacturer||null,_category:input.category||null,_size:input.size||null,_unit:input.unit||null,_barcode:input.barcode||null,_slug:input.slug||null,_image_url:input.imageUrl||null});return{data:r.data as string|null,error:r.error};}
export async function deleteAdminProduct(id:string,name:string){const r=await rpcMutation('admin_delete_product',{_product_id:id,_confirm_name:name});return{error:r.error};}
export async function saveAdminEstablishment(input:{id?:string|null;name:string;neighborhood?:string;kind?:string;slug?:string;shortDescription?:string;logoUrl?:string;isVerified?:boolean;isDemo?:boolean}){
 const r=await rpcMutation('admin_save_establishment',{_id:input.id||null,_name:input.name,_neighborhood:input.neighborhood||null,_kind:input.kind||null,_slug:input.slug||null,_short_description:input.shortDescription||null,_logo_url:input.logoUrl||null,_is_verified:Boolean(input.isVerified),_is_demo:Boolean(input.isDemo)});
 if(!r.error){
   void supabase?.from('audit_logs').insert({
     action: 'establishment_update',
     details: `Estabelecimento ${input.name} (${input.id||'novo'}) atualizado: verificado=${input.isVerified}`,
     entity_id: input.id
   });
 }
 return{data:r.data as string|null,error:r.error};
}
export async function deleteAdminEstablishment(id:string,name:string,deleteDemoOperation=false){
 const r=await rpcMutation('admin_delete_establishment',{_establishment_id:id,_confirm_name:name,_delete_demo_operation:deleteDemoOperation});
 if(!r.error){
   void supabase?.from('audit_logs').insert({
     action: 'establishment_delete',
     details: `Estabelecimento ${name} (${id}) excluído`,
     entity_id: id
   });
 }
 return{error:r.error};
}
export async function setAdminProductPrice(productId:string,establishmentId:string,value:number){const r=await rpcMutation('admin_set_product_price',{_product_id:productId,_establishment_id:establishmentId,_value:value});return{error:r.error};}
export async function deleteAdminProductPrice(productId:string,establishmentId:string){const r=await rpcMutation('admin_delete_product_price',{_product_id:productId,_establishment_id:establishmentId});return{error:r.error};}
export async function uploadAdminProductImage(file:File,productKey:string){if(!supabase)return{url:null,error:'Supabase indisponível'};if(!file.type.startsWith('image/'))return{url:null,error:'Selecione um arquivo de imagem.'};if(file.size>5*1024*1024)return{url:null,error:'A imagem deve ter no máximo 5 MB.'};const ext=(file.name.split('.').pop()||'webp').toLowerCase().replace(/[^a-z0-9]/g,'');const safe=(productKey||'produto').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'produto';const path=`admin/${safe}-${Date.now()}.${ext}`;const{error}=await supabase.storage.from('products').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});if(error)return{url:null,error:error.message};const{data}=supabase.storage.from('products').getPublicUrl(path);return{url:data.publicUrl,error:null};}