using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Xml.Linq;
using GrainInterfaces;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Orleans;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.DataProtection;

namespace Webapp.Services
{
    public static class OrleansDataProtectionBuilderExtensions
    {
        public static IDataProtectionBuilder PersistKeysToOrleans(this IDataProtectionBuilder builder, IClusterClient clusterClient)
        {
            builder.Services.Configure<KeyManagementOptions>(options =>
            {
                options.XmlRepository = new OrleansXmlRepository(clusterClient);
            });
            return builder;
        }
    }

    public class OrleansXmlRepository : IXmlRepository
    {
        private const string DataProtectionKeysName = "DataProtection-Keys";
        readonly IClusterClient grainClient;
        public OrleansXmlRepository(IClusterClient grainClient)
        {
            this.grainClient = grainClient;
        }

        public IReadOnlyCollection<XElement> GetAllElements() => GetAllElementsCore().ToImmutableList();

        public IEnumerable<XElement> GetAllElementsCore()
        {
            var data = grainClient.GetGrain<IStringStoreGrain>(DataProtectionKeysName).GetAllStrings().GetAwaiter().GetResult();

            if (data == null)
            {
                yield break;
            }
            else
            {
                foreach (var value in data)
                {
                    yield return XElement.Parse(value);
                }        
            }
        }

        public void StoreElement(XElement element, string friendlyName)
        {
            grainClient.GetGrain<IStringStoreGrain>(DataProtectionKeysName)
                .StoreString(element.ToString(SaveOptions.DisableFormatting))
                .GetAwaiter()
                .GetResult();
        }
    }
}
