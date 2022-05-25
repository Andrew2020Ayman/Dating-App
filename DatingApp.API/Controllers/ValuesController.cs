using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
 
namespace DatingApp.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")] 
    public class ValuesController : ControllerBase
    {
          private readonly DataContext context;

        public ValuesController(DataContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetValues()
        {
            var values = await context.Values.ToListAsync();
            return Ok(values);
        }
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetValueById(int id){
            var Value = await context.Values.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(Value);
        }
    }
}
