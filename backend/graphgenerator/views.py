from django.shortcuts import render
from django import http
import json
import copy
import math

from rest_framework.decorators import api_view

dummy_data = [{"id":"ade4912fd8eaef703ec102f642554981b618e145","title":"Surface modification with hierarchical CuO arrays toward a flexible, durable superhydrophobic and self-cleaning material","paperAbstract":"Abstract A simple hydrothermal method is reported here to in-situ fabricate hierarchical CuO spheres on polyimide (PI). After introducing a coating layer of low surface energy, superhydrophobicity is imparted to resultant films, where the wetting state of water droplet can be well-controlled by simply adjusting the micro/nano-structures of CuO. Particularly, the superhydrophobic surface can resist acid- and base-corrosion, high and low temperatures, flushing and ultrasonication, showing high durability against these extreme treatments. In addition, the film has a self-cleaning property toward organic and inorganic dusts. We believe the superhydrophobic and flexible PI films with self-cleaning function are of great interest to practical outdoor applications.","authors":[{"name":"Chang-Lian  Xu","ids":["92187948"]},{"name":"Fei  Song","ids":["143737931"]},{"name":"Xiu-Li  Wang","ids":["47118974"]},{"name":"Yu-Zhong  Wang","ids":["2667055"]}],"inCitations":["b6737cb63c44e459a99e5e90615b6f6a3ce6cdb5","0d827afded27a5c5e20eaa3ae820ded93329b6ac","076768f697601da3a7b4183581597ba9ed7ec067","496f0d7a7f38f014287c4ea9856881ea2ce1cbb8","d6a42568955b26121b5ae9425c33937865ce5577","85dface43b96cdba5b7d627ec93e485eceaffb12","8f9c22d1b769902abe7bb7eeb7a7f6a00c2cf158","0d410c0b87bc68675482704b7ade563bf88b2740","518de661602da5cf545efb0884bc3270886fee54","f8fb501c17ff3138f3092197d593df4f3419788f","96c7699127feccfce13a5ff162b8c58d126e93f5","b417cb856530262277f0290ccf1e14ce25d0d87c","b86fbaad1ad5c960b3a857d3d237add507878865","ab5a1cf16645fb49b477f9982e666cf6fae36c75","ae13fbb90fc316436537259c54f315ab6f1b1a61","fb9fd43b0ab5382b7b375947ad3ac56f1c869da5","d2548e539e52c2bb8d30af671acda270a6e93ad1","056799a1ed35864860aeff9ca7957d7fb146c9bf","642acf09eb3df98e3ade84665c3b9cc27cd640ea","1604d6532736c73534c2ac8f770dfbf1f22dafdc","c5829123cb1a9c3ab495227d6229fb91e1453cbc","9bf45493a3ab822368ecd13d3b7686a25b9de7a3","1366b9f619cd8651641689bb382835d9d3519d32","373d7fb64993ac20f856b9f0d7d77605e37cbdac","d39e05d28fcf308eb7ad0e591e91a2da2e02b990","ae495763b6777dd029b48a862e31912908ea8b4b","5e4cb3294615146373d0ffe251f9a5cc471ae049","e9895c0aa1aee12f203af785a469d58479245301","415223d2af11615e4b80d7b6052409d18442def5","a9c68d52a1377d7cd093523b26dece78b689710d","a1317d286c4855da59b4ecb3f284075aa4bfd2c8","45727f35d48c8207724a44d183aa7a65df5b28e9","715b8f4b73bdec9f5e0b8a29c58992766247586e","6142a71b9d3d187c6e52dded9da0bcf010fc8c5d","0a26739cf57184727f767193c04c54d81984b5e4","170fe026b6bfb701176d8b589f020a04011548ea","8cc17b51dfc65bcdb5320af3fbb5429594942bdc","c53f36f7c76d892fec7038a860af557f972be397","772f959da7d0113b3c928f5ed91eb41aa7588046","892eecaf43ad46126d2c2a2d6c2ea222619cc4e2","cf25d0f345a9d4bfbaed11774decbe10cbd06418","201051134dfc4f5693109d0cc421ff8d2c016a0d","7a66d6ce9cf74753071fad71270196460f7f523d","55f2be87d16b47c71682d41110909603806d5d76","742a39bfca67e1f14aff6be141ff1584deafff4e","b91d41f240151e02ef8124c8d0136cfe106ca6ea","3af031f4a1a631866bd8c946964d0172ecb24a7e","4c9f9d9e3226a8a4ff5290c3c1bb91df5973a5ec","dc7925c72b9fe127280277d5bc2a127f81ef0494","e11a5e8e9c894269021685a8120875f1147920c9","3bb32626d56b401d0722f3f42ce79da917b50695","fba2f70b13585d76f338378c173c845e034caaff","269f0828d50b3c626e12aac99ba99d2153168ef4","9440714fb9cf5c1153fe9a45db94c9fc57a8c028","e7dcc0890c0e1af16a54babb0862ee6a53c5c3d8","10a3027d2007ba97cb98f264ba31757eeeecde89"],"outCitations":["a281495559d1f3c0a7c877bc12a61118c12430a2","5f73e70e279c9c7e87ce27d49848996e36175580","2934429b9096830d67120f53b65a9bc2391e68dd","4dc0bf36cc81514b705ad1e3b8ec90e4cee5c56a","2457add367bf9b85ffe9fea6d119f25bb3a5ea39","54c2c8e49a1958b29e1bc7dc4b005f3edb04ff35","db91142a3b389d753e943d33bf6caec973a3af30","27ab89cbd0b53a5028eeb5dac44a4c68e8e16a73","a6acc3f85644068d9e0bcc9375d2e5bf47742106","dc511d6606ec3f0c8f3e0664d35a84df3bdf0ed4","f6b7870bed4506c9cc05c6794f969105c3273f70","1edd9ac9ca8cf5bf9d03ebc5b0eee985330d488e","676731b25978d062cca009624879c7b8424d2a58","99cdd7e8ae182a5379c4f62000984b15d9ab9b42","779493f5adff967cd3f5a22d92339ee81b9b6abf","c6fe629f848c38530376e870b6fbe3ae47575696","01c0e6027916aa90b1bad44d2cc53fe86ca4e0df","bfb681b40bc924845fbe076e97f5b542a4e06178","8d4fd5faa628b29c7d7c91467a8d0e80345308ac","642cc971ef21220dfd6c9bae053f325e3fde54c7","cef340d6d25d333ab7d67312723a5685675df04c","022c688852beb8ddfa0f8ffc2954fd38b7b4e141","3ba829496c99d26345450ddd8c2485155bb775e7","611fd7c5501d7691fc0d87d292aec52d9e7da145","715351184a216eacee5946b840a79187e32ae7fe","43c66856becd5f9b0729c6f874b6c85ac21be211","2071278f2dc93cca19f1aa4be563b3e9e749f6a0","aa55686ef03061187e61f0e1f64c86de47aead55","e9a9ee87513d4e6157eed18d1d89bee15e92cfa3","dbd6bdc399f79a2bc8d6e2e36a54cc4856b64c5b","312a9682f4f05fee38ba955b58eaf15af202eb6a","03b1f1bcc389452708b4a3c4afc82c3fec028099","2c2001e49c1edbb2130f5e867bdcce8189b7be0e","f60e0ad1bc72b69bda06eee0191c8e0b2c7c330e","dbe2c345f02fc734f717dc6ea4af6927bf332247","259d63a43a75353be18ce375ea0d86af146b15fc","c5ce21f4bd64e6b456adb47267e0456fc45ae1f3","7bf8125325fbdd99eb215a0c956aad50755cbb5e","ea59f5a5c7f0a09547f9e48ac793da443d81ef47","2523ab5e113d2a6fa0a157eb70cfb7cd96dd262b","f378d29f022ec5fa00f096e653a7f5e3acadb2db","6a70fe20be8375dfe9478ccb8338587d0225e62a"],"year":2017,"s2Url":"https://semanticscholar.org/paper/ade4912fd8eaef703ec102f642554981b618e145","sources":[],"pdfUrls":[],"venue":"","journalName":"Chemical Engineering Journal","journalVolume":"313","journalPages":"1328-1334","doi":"10.1016/J.CEJ.2016.11.024","doiUrl":"https://doi.org/10.1016/J.CEJ.2016.11.024","pmid":"","fieldsOfStudy":["Materials Science"],"magId":"2555052198","s2PdfUrl":"","entities":[]},
        {"id":"03babdf3e61730b68ca47c21a0edcdc47e5cba8c","title":"Improved scales of spaces and elliptic boundary-value problems. III","paperAbstract":"We study elliptic boundary-value problems in improved scales of functional Hilbert spaces on smooth manifolds with boundary. The isotropic Hörmander-Volevich-Paneyakh spaces are elements of these scales. The local smoothness of a solution of an elliptic problem in an improved scale is investigated. We establish a sufficient condition under which this solution is classical. Elliptic boundary-value problems with parameter are also studied.","authors":[{"name":"V. A. Mikhailets","ids":["101770011"]},{"name":"A. A. Murach","ids":["100765468"]}],"inCitations":[],"outCitations":[],"year":2007,"s2Url":"https://semanticscholar.org/paper/03babdf3e61730b68ca47c21a0edcdc47e5cba8c","sources":[],"pdfUrls":[],"venue":"","journalName":"Ukrainian Mathematical Journal","journalVolume":"59","journalPages":"744-765","doi":"10.1007/s11253-007-0048-6","doiUrl":"https://doi.org/10.1007/s11253-007-0048-6","pmid":"","fieldsOfStudy":[],"magId":"","s2PdfUrl":"","entities":[]},
        {"id":"745e1b5e988e7bd62d3fd6011a6dc74ff63c6976","title":"Surface segregation of impurities (manganese, chromium and calcium) on vacuum annealed 36% Ni-Fe alloy","paperAbstract":"","authors":[{"name":"Michihiko  Inaba","ids":["73451171"]},{"name":"Yoshinori  Honma","ids":["94581425"]},{"name":"Tsutomu  Yamashita","ids":["144612565"]},{"name":"Masashi  Awa","ids":["92220605"]}],"inCitations":["147ae089993f34932a67dda0e1e3d27f65398277","765b05c7ed1345c581b43ada0bdfa5355c7ab372","7ebbaf6528209fa5939ef97457f78bb21a8847f3","cb5a1c555b5252319af3cdb7c5c29ca5556bec21"],"outCitations":["f7f57eb450e44ae2b82e32c4fdb8e55164d83b94","fe4e3f7493f7b92d8f0230773d9a74f6fc264bcc","0a2e537e7c4b70a396afc5dfd58f1d3d2665fc96","565d249e32affbb399736eb403a9c3278f17685b","a437fbaa2c2d5182dd74b7fafa9f3c3d67ae0170","1697b85bf90d998c8c98f3de16ccca7c839ef162","6969dc6cdd6e97e8d07267c3ae5fa54ebbf36250"],"year":1985,"s2Url":"https://semanticscholar.org/paper/745e1b5e988e7bd62d3fd6011a6dc74ff63c6976","sources":[],"pdfUrls":[],"venue":"","journalName":"Journal of Materials Science Letters","journalVolume":"4","journalPages":"818-821","doi":"10.1007/BF00720512","doiUrl":"https://doi.org/10.1007/BF00720512","pmid":"","fieldsOfStudy":["Materials Science"],"magId":"2023093434","s2PdfUrl":"","entities":[]},
        {"id":"0ca2b4e22a8a31f19a0dedf3a38549b0e5a9fd5d","title":"[Effect of long-term administration of parotin tablets in gastroptosis].","paperAbstract":"","authors":[{"name":"A  Matsuoka","ids":["2562735"]}],"inCitations":[],"outCitations":[],"year":1973,"s2Url":"https://semanticscholar.org/paper/0ca2b4e22a8a31f19a0dedf3a38549b0e5a9fd5d","sources":["Medline"],"pdfUrls":[],"venue":"Horumon to rinsho. Clinical endocrinology","journalName":"Horumon to rinsho. Clinical endocrinology","journalVolume":"21 6","journalPages":"\n          641-3\n        ","doi":"","doiUrl":"","pmid":"4738809","fieldsOfStudy":["Medicine"],"magId":"2411529736","s2PdfUrl":"","entities":[]}]

dummy_dict = {item['id']: item for item in dummy_data}

dummy_similarities = [
    {'name': 'O-Title Similarity',
     'description': 'Similarity is |x-y|-1 where x,y are the occurences of the letter o in the respective titles',
     'function': lambda x,y: abs(x['title'].count('o') - y['title'].count('o'))
    },
    {
     'name': 'S-Title Similarity',
     'description': 'Similarity is |x-y|-1 where x,y are the occurences of the letter s in the respective titles',
     'function': lambda x,y: abs(x['title'].count('s') - y['title'].count('s'))
    }
]

# Create your views here.
@api_view(['GET'])
def search(request):
    """
    returns a list of papers depending on the search query

    request needs to have 'query':str field
    """
    query = request.query_params.get('query', None)
    if query is None:
        return http.HttpResponseBadRequest('No query supplied')
    page = request.query_params.get('page', 1)
    pagesize = request.query_params.get('pagesize', 20)

    return http.JsonResponse({'data': dummy_data, 'max_pages': (len(dummy_data)-1)//pagesize + 1}, safe=False)


@api_view(['GET'])
def generate_graph(request):
    """
    finds relevant papers
    generates a tensor with paper similarities of relevant papers

    request needs to have 'papier_id':any field
    """

    papers = dummy_data

    similarities = [{'name': sim['name'],
     'description': sim['description']} for sim in dummy_similarities]

    tensor = [[[sim['function'](p1, p2) for p2 in dummy_data] for p1 in dummy_data] for sim in dummy_similarities]

    return http.JsonResponse({'tensor': tensor, 
                              'paper': papers,
                              'similarities': similarities})

    return http.HttpResponse('Generate Graph Endpoint')

@api_view(['GET'])
def get_paper(request):
    """
    returns paper metadata based on (some tbd) id

    request needs to have 'paper_id':any field
    """
    print(request.query_params)
    paper_id = request.query_params.get('paper_id', None)
    if paper_id not in dummy_dict:
        return http.HttpResponseBadRequest('Paper not found')
    return http.JsonResponse(dummy_dict[paper_id])
    

