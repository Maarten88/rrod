using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;


namespace Webapp.Services
{
    public class CompressedStaticFilesMiddleware
    {
        private static Dictionary<string, string> compressionTypes = new Dictionary<string, string>()
        {{"gzip", ".gz" },
         {"br", ".br" }};

        private readonly IHostingEnvironment _hostingEnv;
        private readonly StaticFileMiddleware _base;
        private readonly ILogger _logger;
        public CompressedStaticFilesMiddleware(RequestDelegate next, IHostingEnvironment hostingEnv, IOptions<StaticFileOptions> staticFileOptions, ILoggerFactory loggerFactory)
        {
            if (next == null)
            {
                throw new ArgumentNullException(nameof(next));
            }

            if (hostingEnv == null)
            {
                throw new ArgumentNullException(nameof(hostingEnv));
            }

            if (staticFileOptions == null)
            {
                throw new ArgumentNullException(nameof(staticFileOptions));
            }

            if (loggerFactory == null)
            {
                throw new ArgumentNullException(nameof(loggerFactory));
            }

            _hostingEnv = hostingEnv;
            _logger = loggerFactory.CreateLogger<CompressedStaticFilesMiddleware>();
            var contentTypeProvider = staticFileOptions.Value.ContentTypeProvider ?? new FileExtensionContentTypeProvider();
            var fileExtensionContentTypeProvider = contentTypeProvider as FileExtensionContentTypeProvider;
            if (fileExtensionContentTypeProvider != null)
            {
                fileExtensionContentTypeProvider.Mappings[".br"] = "application/brotli";
            }

            staticFileOptions.Value.ContentTypeProvider = contentTypeProvider;
            staticFileOptions.Value.FileProvider = staticFileOptions.Value.FileProvider ?? hostingEnv.WebRootFileProvider;
            staticFileOptions.Value.OnPrepareResponse = ctx =>
            {
                foreach (var compressionType in compressionTypes.Keys)
                {
                    var fileExtension = compressionTypes[compressionType];
                    if (ctx.File.Name.EndsWith(fileExtension, StringComparison.OrdinalIgnoreCase))
                    {
                        string contentType = null;
                        if (contentTypeProvider.TryGetContentType(ctx.File.PhysicalPath.Remove(ctx.File.PhysicalPath.Length - fileExtension.Length, fileExtension.Length), out contentType))
                            ctx.Context.Response.ContentType = contentType;
                        ctx.Context.Response.Headers.Add("Content-Encoding", new[] { compressionType });
                    }
                }
            };

            _base = new StaticFileMiddleware(next, hostingEnv, staticFileOptions, loggerFactory);
        }

        public Task Invoke(HttpContext context)
        {
            if (context.Request.Path.HasValue)
            {
                string acceptEncoding = context.Request.Headers["Accept-Encoding"];
                FileInfo matchedFile = null;
                string[] browserSupportedCompressionTypes = context.Request.Headers["Accept-Encoding"].ToString().Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                var orginalFilePath = System.IO.Path.Combine(
                                _hostingEnv.WebRootPath, context.Request.Path.Value.StartsWith("/")
                                ? context.Request.Path.Value.Remove(0, 1)
                                : context.Request.Path.Value
                            );
                var orginalFile = new FileInfo(orginalFilePath);
                if (orginalFile.Exists)
                {
                    foreach (var compressionType in compressionTypes.Keys)
                    {
                        if (browserSupportedCompressionTypes.Contains(compressionType, StringComparer.OrdinalIgnoreCase))
                        {
                            var fileExtension = compressionTypes[compressionType];
                            var filePath = orginalFilePath + fileExtension;
                            var file = new FileInfo(filePath);
                            if (file.Exists && file.Length < orginalFile.Length)
                            {
                                if (matchedFile == null)
                                    matchedFile = file;
                                else if (matchedFile.Length > file.Length)
                                    matchedFile = file;
                            }
                        }
                    }
                    if (matchedFile != null)
                    {
                        var matchedPath = context.Request.Path.Value + matchedFile.Extension;
                        _logger.LogInformation($"Request: {context.Request.Path.Value}, matched: {matchedPath}, ({matchedFile.Length} instead of {orginalFile.Length} bytes)");
                        context.Request.Path = new PathString(matchedPath);
                        return _base.Invoke(context);
                    }
                }
            }
            return _base.Invoke(context);
        }
    }
}

namespace Microsoft.AspNetCore.Builder
{
    using Webapp.Services;
    public static class ResponseCompressionBuilderExtensions
    {
        public static IApplicationBuilder UseCompressedStaticFiles(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CompressedStaticFilesMiddleware>();
        }
    }
}