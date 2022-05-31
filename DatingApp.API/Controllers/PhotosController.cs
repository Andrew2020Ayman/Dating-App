using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController :ControllerBase
    {
        private readonly IDatingRepository repo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private Cloudinary _cloundinary;

        public PhotosController(IDatingRepository repo, IMapper mapper , IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.repo = repo;
            this.mapper = mapper;
            this.cloudinaryConfig = cloudinaryConfig;

            Account acc =new Account(
                cloudinaryConfig.Value.CloudName,
                cloudinaryConfig.Value.ApiKey,
                cloudinaryConfig.Value.ApiSecert
            );

            _cloundinary = new Cloudinary(acc);   
        }

       /*  [HttpGet("{id}",Name = nameof(GetPhoto))]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await repo.GetPhoto(id);
            var photo = mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        } */

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, 
         [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }
            var userFromRepo = await repo.GetUser(userId);

            var file =  photoForCreationDto.File;
            var uploadResult = new ImageUploadResult();
            if(file.Length > 0)
            {
                using(var stream =  file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File  = new FileDescription(file.Name,stream),
                        Transformation = new Transformation()
                             .Width(500).Height(500).Crop("fill").Gravity("face" )
                    };
                    uploadResult = _cloundinary.Upload(uploadParams);
                }
            }
           photoForCreationDto.Url = uploadResult.Url.ToString();
           photoForCreationDto.PublicID = uploadResult.PublicId;
           var photo = mapper.Map<Photo>(photoForCreationDto);

           if(!userFromRepo.Photos.Any(u => u.IsMain))
                photo.IsMain = true;
            
            userFromRepo.Photos.Add(photo);
            if(await repo.SaveAll())
            {
               var photoToReturn = mapper.Map<PhotoForReturnDto>(photo);
               
              return CreatedAtRoute("getPhoto", new { userId = userId, id = photo.Id }, photoToReturn );
            }
            return BadRequest("Could not add the photo");
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> getPhoto(int id)
        {
            var photoFromRepo = await repo.GetPhoto(id);
            var photo = mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId,int id){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }
            var user = await repo.GetUser(userId);
            if(!user.Photos.Any(p => p.Id == id))
              return Unauthorized();
            
            var photoFromRepo = await repo.GetPhoto(id);
            if(photoFromRepo.IsMain)
                return BadRequest("This is already the main photo");
            
            var currentMainPhoto = await repo.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if(await repo.SaveAll())
                 return NoContent();

            return BadRequest("Could not set photo to main");
        }

        [HttpDelete("{id}")] 
        public async Task<IActionResult> DeletePhoto(int userId,int id){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }
            var user = await repo.GetUser(userId);
            if(!user.Photos.Any(p => p.Id == id))
              return Unauthorized();
            
            var photoFromRepo = await repo.GetPhoto(id);
            if(photoFromRepo.IsMain)
                return BadRequest("You can not delete your main photo");

            if(photoFromRepo.PublicID != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicID);
                var result = _cloundinary.Destroy(deleteParams);
                if(result.Result == "ok"){
                    repo.Delete(photoFromRepo);
                }  
            }
            if(photoFromRepo.PublicID == null){
                repo.Delete(photoFromRepo);
            }

            if(await repo.SaveAll())
                return Ok();

            return BadRequest("Failed to delete the photo");
        }
    }
}