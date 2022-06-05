using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.Helpers
{
    public static class Extionsions
    {
        public static void AddApplcationError(this HttpResponse response,string message)
        {
            response.Headers.Add("Application-Error",message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");    
        }

        public static void AddPagination(this HttpResponse response,int currentPage,
            int itemsPerPage,int TotalItems,int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage,itemsPerPage,TotalItems,totalPages);
            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination",JsonConvert.SerializeObject(paginationHeader,camelCaseFormatter)) ;
            response.Headers.Add("Access-Control-Expose-Headers","Pagination");
        }
        public static int CalculateAge(this DateTime theDateTime){
            var Age = DateTime.Today.Year - theDateTime.Year ;
            if(theDateTime.AddYears(Age) > DateTime.Today)
                Age--;

                return Age;
        }
    }
}