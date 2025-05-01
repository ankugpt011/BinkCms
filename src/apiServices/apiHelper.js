export const PartnerSid =()=> 'GcVY3jdBSZFsUy2wcsIjPLMfH2oA7YGKmiPiXPFTDa9yDMpXqeRN7QQ0HGEhIRAn'
export const PartnerBaseUrl =()=> 'https://apis.hocalwire.com'


export const PartnerCodeApi =(partnersCode)=> `/dev/h-api/partner/information?partner_code=${partnersCode}`
export const LoginApi=(appid,partner,emailid,userpassword,action)=>`/dev/h-api/app-login?app=${appid}&partner=${partner}&login=${emailid}&password=${userpassword}&action=${action}`
export const FetchStoryApi =(startIndex=0,count=0,sessionId,newsIds)=> `/dev/h-api/newsv2?startIndex=${startIndex}&count=${count}&sessionId=${sessionId}&newsIds=${newsIds}`
export const DraftStoryApi =(startIndex,count,sessionId)=> `dev/h-api/story?startIndex=${startIndex}&count=${count}&sessionId=${sessionId}`
export const api_google_register =(name,email,first_name,last_name,id,image,devcieId,type)=> `/dev/h-api/register?name=${name}&email=${email}&first_name=${first_name}&last_name=${last_name}&id=${id}&image=${image}&deviceId=${devcieId}&type=${type}`;
export const Create_Story_PageLayout =()=>`/dev/h-api/partner/pagelayout`
export const CategoryList =()=>'/dev/h-api/category'
export const LocationList =()=>'/dev/h-api/locations'
export const TagsList =()=>'/dev/h-api/tags'
export const ConfigList =()=>'/dev/h-api/config'
export const AuthorList =(search)=>`/dev/h-api/authors?search=${search}`
export const CreateStoryApi =()=>'/servlet/AdminController?command=partner.ServletSinglePageStory&isAutoSave=false&checkTitle=true' 


