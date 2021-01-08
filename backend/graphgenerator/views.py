from django.shortcuts import render
from django import http
import json

from rest_framework.decorators import api_view

dummy_data = [{"id":"618bc3157edf07afd08eaba3d23c8bdfba7c4b84","title":"33 INVITED Combination of tyrosine kinase inhibitors, or monoclonal antibodies, with radiotherapy and chemotherapy","paperAbstract":"","authors":[{"name":"M. J. Ratain","ids":["3505532"]}],"inCitations":[],"outCitations":[],"year":2006,"s2Url":"https://semanticscholar.org/paper/618bc3157edf07afd08eaba3d23c8bdfba7c4b84","sources":[],"pdfUrls":[],"venue":"","journalName":"Ejc Supplements","journalVolume":"4","journalPages":"14","doi":"10.1016/S1359-6349(06)70039-8","doiUrl":"https://doi.org/10.1016/S1359-6349%2806%2970039-8","pmid":"","fieldsOfStudy":["Medicine"],"magId":"2032332581","s2PdfUrl":"","entities":[]},
{"id":"d3ff20bc1a3bb222099ef652c65d494901620908","title":"Franklin, Bruce H (2010). War Stars. Guerra, ciencia ficción y hegemonía imperial. Buenos Aires: Final Abierto. Franklin, Bruce H (2009). Vietnam y las fantasías norteamericanas. Buenos Aires: Final Abierto.","paperAbstract":"","authors":[{"name":"Pablo  Francescutti","ids":["114162097"]}],"inCitations":["7f06236ff5178025b007a0169b662e17c0c97080","583deb28cfc856a725297d559c6246e0707fcb9c"],"outCitations":[],"year":2012,"s2Url":"https://semanticscholar.org/paper/d3ff20bc1a3bb222099ef652c65d494901620908","sources":[],"pdfUrls":[],"venue":"","journalName":"Papeles del CEIC: International Journal on Collective Identity Research","journalVolume":"2012","journalPages":"","doi":"","doiUrl":"","pmid":"","fieldsOfStudy":["Art"],"magId":"1586193067","s2PdfUrl":"","entities":[]},
{"id":"705aef0d9386adb25aed4d3c5e16bd1ecb00ab3a","title":"A surgical experience of 1200 cases of penetrating brain wounds in battle, N. W. Europe, 1944-45.","paperAbstract":"","authors":[{"name":"J M SMALL","ids":["2619598"]},{"name":"E A TURNER","ids":["47282552"]}],"inCitations":["da23bd2a8453a81c76435db78c6cf76417561852","8e8802d1366e34b1bd0247803742764d25619d26","23241e4e1f60e8cd8b0c3673895c3222bec46fc5","fb752692153b9201c6c7a09066ecdb4224975345","1ac3946227aebbe0065b4a604c84b2cdec19330a","44fdf46e57c142abbcb46106fde35118ded92913","12d3c118c699b7d5b51024e5a2776ea52df3b87b","f1d52b2356c8c2906309c8dd91b8b86139fc4f19","241b15d57104d82fb3b3fca57792658511661971","33c5f963d4c1eccf775695dbd991c371320f4421","348c966cf96051ea314c7a55100d177e9a8372a1","6c1d2a3a1a460ff724372c66f65b3da0417a914f","8b2e9930a67be1a89b05a73751e10cc548759b6b","a37a1b4e45103fb58d319894dd3d344e6feb333d","1b3598b779f4b94e90b9c81b0106db193e07ec86","cec27376fb8450c673293657ab0d3acd57190d5a","e9ebcd31d6b954f9f3e8ce3e98c61146c3bf4631","6ec6ecc333c80168bc6cff4fcb49bed256fb69cf","cf9a9170b0364a24eb09725fad40c004eaa0c49a","590e5bf1d7dc61ca9a529c1ec3a6a54089d0ba4f","7ed1f60b5855d073977856e86100fb8872da9642","d7aa92efb7bd6d873ccc62c642e3e6ee1a428307","b3bc2f99ada713dcacf4808bdee8161c1ea3fb79","a82f4f914d3c8b16447317a351dde00fdf8922b7","f16400e1f0c8339607eff6ada438bc6e1bcaa163","79b99d75c89a829ba7e44aeaef901f545be5b2d2","0a430ada300a0cc1dd87585adbe8d6d38d743715","44cc2863d2a47f68e495ca2ca9ee1c7b03c57a8d","40f2963d4c44f889840cfd5564292679bad6211e","99900faea6b8031997c932d6bbf05c32dfd63765","7f56ead0e9d69553726e7ec0628d3277c102f9d4","c0faacb765356e6da2e7466e673c6582bfd26273"],"outCitations":[],"year":1947,"s2Url":"https://semanticscholar.org/paper/705aef0d9386adb25aed4d3c5e16bd1ecb00ab3a","sources":["Medline"],"pdfUrls":[],"venue":"The British journal of surgery","journalName":"The British journal of surgery","journalVolume":"55 Suppl 1","journalPages":"\n          62-74\n        ","doi":"","doiUrl":"","pmid":"18918450","fieldsOfStudy":["Medicine"],"magId":"2273784851","s2PdfUrl":"","entities":[]},
{"id":"078d5594a076c7abd033f5e260fa9ce2d5a71991","title":"The Newtonian casino","paperAbstract":"Glitter gulch silver city rambling and gambling driving around the mode map radios from other planets debugging the invention of the wheel strange attractors exploring the envelope lucky lady sensitive dependence on initial conditions small is beautiful magic shoes the city of computation rebel science \"Dear Eudaemons\" Cleopatra's barge. Epilogue - the intergalactic infandibulum.","authors":[{"name":"Thomas A. Bass","ids":["69378875"]}],"inCitations":["4bc9e6a58ad49161056efafa96ee697e9f363983","f7ae773297d070a8b97e2d2d585e1546349da388","d367835e7b9705449cf6c7614aea54157ce4e149","b68dc67763019fff0857f8e0fcd9fd0aceeeb38a","ca0e1f12f552020a96a1a606ad53abdf5fca591a","ceadd8d4eccbde086dcf4a0664847acf0b83215d","0728142fa9ba9db1c1c08a76031ce593ca13f041"],"outCitations":["fc22ca9ea41cf88a6399f8191b95d5b240653ca0","90ad1f4f89da63fbf3184b645397a3ee221cec8d","6aca126b11a08f529fe6188f25bccf84d11a1130","2e4f343010e05e61ce440ab0d4ee4243f81a2bab","13b349159b9de6c4c384908338901a46effe0128"],"year":1990,"s2Url":"https://semanticscholar.org/paper/078d5594a076c7abd033f5e260fa9ce2d5a71991","sources":[],"pdfUrls":["http://www.cs.colorado.edu/~lizb/chaos/ps12.pdf"],"venue":"","journalName":"","journalVolume":"","journalPages":"","doi":"","doiUrl":"","pmid":"","fieldsOfStudy":["Engineering"],"magId":"1485222277","s2PdfUrl":"","entities":[]},
{"id":"5bb611e008d12f5f825622f136aee71ef6592a10","title":"Effects of Dipterex on the AChE and ATPase Activities in Common Carp(Cyprinus carpio) Tissues","paperAbstract":"When fishes exposed to a series of concentrations of Dipterex, the activities of enzymes in the tissues were: brain AChEkidney ATPasegill ATPase. The inhibition associated with death in acute toxicity experiment in brain AChE activity could reach as high as 95%, while the inhibition associated with death in gill ATPase and kidney ATPase was 50%～60%. The results showed that AChE inhibition was not the only factor involved in the death caused by organophosphate pesticide poisoning, the noncholinergic toxicity also contributed to the death.","authors":[{"name":"Liu  Jiesheng","ids":["9446466"]}],"inCitations":[],"outCitations":[],"year":1997,"s2Url":"https://semanticscholar.org/paper/5bb611e008d12f5f825622f136aee71ef6592a10","sources":[],"pdfUrls":[],"venue":"","journalName":"Research of Environmental Sciences","journalVolume":"","journalPages":"","doi":"","doiUrl":"","pmid":"","fieldsOfStudy":["Biology"],"magId":"2351250898","s2PdfUrl":"","entities":[]},
{"id":"3b2c577b65affa0b41dc9ac5a33e170961aeb6dd","title":"Author’s response: Severity of iatrogenic ovarian hyperstimulation syndrome (OHSS) can be predicted by N680allele of FSH receptor","paperAbstract":"","authors":[{"name":"Caroline  Daelemans","ids":["48855730"]},{"name":"Guillaume  Smits","ids":["35682586"]},{"name":"Viviane De Maertelaer","ids":["16689063"]},{"name":"Sabine  Costagliola","ids":["143807272"]},{"name":"Yvon  Englert","ids":["4779321"]},{"name":"Gilbert  Vassart","ids":["1935204"]},{"name":"Anne  Delbaere","ids":["5206525"]}],"inCitations":[],"outCitations":[],"year":2005,"s2Url":"https://semanticscholar.org/paper/3b2c577b65affa0b41dc9ac5a33e170961aeb6dd","sources":[],"pdfUrls":[],"venue":"","journalName":"The Journal of Clinical Endocrinology and Metabolism","journalVolume":"90","journalPages":"4978-4979","doi":"","doiUrl":"","pmid":"","fieldsOfStudy":["Medicine"],"magId":"745300409","s2PdfUrl":"","entities":[]},
{"id":"dde90799a967d0fe265f353f295d5525828e0131","title":"Беллетризация как приём в биографиях Джорджианы, герцогини Девонширской","paperAbstract":"","authors":[{"name":"Аюпова Камиля Фаритовна","ids":["148475702"]}],"inCitations":[],"outCitations":[],"year":2017,"s2Url":"https://semanticscholar.org/paper/dde90799a967d0fe265f353f295d5525828e0131","sources":[],"pdfUrls":[],"venue":"","journalName":"","journalVolume":"159","journalPages":"","doi":"","doiUrl":"","pmid":"","fieldsOfStudy":["Philosophy"],"magId":"2947130172","s2PdfUrl":"","entities":[]},
{"id":"78c66ba5302d500e9216f7ded74ac428bad8e4e0","title":"Kade (Gunnar). — Die Stellung der zentrale Orte in der kulturland-schaftlichen Entwicklung Bugundas (Uganda) /La situation des places centrales dans le développement régional du Buganda. 1969","paperAbstract":"","authors":[{"name":"Pierre  Vennetier","ids":["104894599"]}],"inCitations":[],"outCitations":[],"year":1973,"s2Url":"https://semanticscholar.org/paper/78c66ba5302d500e9216f7ded74ac428bad8e4e0","sources":[],"pdfUrls":[],"venue":"","journalName":"","journalVolume":"","journalPages":"","doi":"","doiUrl":"","pmid":"","fieldsOfStudy":[],"magId":"2596936052","s2PdfUrl":"","entities":[]},
{"id":"d201ae020a2ea0573deffac7074a379b9d5db6d4","title":"The neck domain of myosin V","paperAbstract":"","authors":[{"name":"Mohammed  Terrak","ids":["48005754"]},{"name":"Walter  Staford","ids":["89444939"]},{"name":"Renne  Lu","ids":["47372865"]}],"inCitations":[],"outCitations":[],"year":2004,"s2Url":"https://semanticscholar.org/paper/d201ae020a2ea0573deffac7074a379b9d5db6d4","sources":[],"pdfUrls":[],"venue":"","journalName":"Biophysical Journal","journalVolume":"86","journalPages":"","doi":"","doiUrl":"","pmid":"","fieldsOfStudy":["Chemistry"],"magId":"2246257302","s2PdfUrl":"","entities":[]},
{"id":"ade4912fd8eaef703ec102f642554981b618e145","title":"Surface modification with hierarchical CuO arrays toward a flexible, durable superhydrophobic and self-cleaning material","paperAbstract":"Abstract A simple hydrothermal method is reported here to in-situ fabricate hierarchical CuO spheres on polyimide (PI). After introducing a coating layer of low surface energy, superhydrophobicity is imparted to resultant films, where the wetting state of water droplet can be well-controlled by simply adjusting the micro/nano-structures of CuO. Particularly, the superhydrophobic surface can resist acid- and base-corrosion, high and low temperatures, flushing and ultrasonication, showing high durability against these extreme treatments. In addition, the film has a self-cleaning property toward organic and inorganic dusts. We believe the superhydrophobic and flexible PI films with self-cleaning function are of great interest to practical outdoor applications.","authors":[{"name":"Chang-Lian  Xu","ids":["92187948"]},{"name":"Fei  Song","ids":["143737931"]},{"name":"Xiu-Li  Wang","ids":["47118974"]},{"name":"Yu-Zhong  Wang","ids":["2667055"]}],"inCitations":["b6737cb63c44e459a99e5e90615b6f6a3ce6cdb5","0d827afded27a5c5e20eaa3ae820ded93329b6ac","076768f697601da3a7b4183581597ba9ed7ec067","496f0d7a7f38f014287c4ea9856881ea2ce1cbb8","d6a42568955b26121b5ae9425c33937865ce5577","85dface43b96cdba5b7d627ec93e485eceaffb12","8f9c22d1b769902abe7bb7eeb7a7f6a00c2cf158","0d410c0b87bc68675482704b7ade563bf88b2740","518de661602da5cf545efb0884bc3270886fee54","f8fb501c17ff3138f3092197d593df4f3419788f","96c7699127feccfce13a5ff162b8c58d126e93f5","b417cb856530262277f0290ccf1e14ce25d0d87c","b86fbaad1ad5c960b3a857d3d237add507878865","ab5a1cf16645fb49b477f9982e666cf6fae36c75","ae13fbb90fc316436537259c54f315ab6f1b1a61","fb9fd43b0ab5382b7b375947ad3ac56f1c869da5","d2548e539e52c2bb8d30af671acda270a6e93ad1","056799a1ed35864860aeff9ca7957d7fb146c9bf","642acf09eb3df98e3ade84665c3b9cc27cd640ea","1604d6532736c73534c2ac8f770dfbf1f22dafdc","c5829123cb1a9c3ab495227d6229fb91e1453cbc","9bf45493a3ab822368ecd13d3b7686a25b9de7a3","1366b9f619cd8651641689bb382835d9d3519d32","373d7fb64993ac20f856b9f0d7d77605e37cbdac","d39e05d28fcf308eb7ad0e591e91a2da2e02b990","ae495763b6777dd029b48a862e31912908ea8b4b","5e4cb3294615146373d0ffe251f9a5cc471ae049","e9895c0aa1aee12f203af785a469d58479245301","415223d2af11615e4b80d7b6052409d18442def5","a9c68d52a1377d7cd093523b26dece78b689710d","a1317d286c4855da59b4ecb3f284075aa4bfd2c8","45727f35d48c8207724a44d183aa7a65df5b28e9","715b8f4b73bdec9f5e0b8a29c58992766247586e","6142a71b9d3d187c6e52dded9da0bcf010fc8c5d","0a26739cf57184727f767193c04c54d81984b5e4","170fe026b6bfb701176d8b589f020a04011548ea","8cc17b51dfc65bcdb5320af3fbb5429594942bdc","c53f36f7c76d892fec7038a860af557f972be397","772f959da7d0113b3c928f5ed91eb41aa7588046","892eecaf43ad46126d2c2a2d6c2ea222619cc4e2","cf25d0f345a9d4bfbaed11774decbe10cbd06418","201051134dfc4f5693109d0cc421ff8d2c016a0d","7a66d6ce9cf74753071fad71270196460f7f523d","55f2be87d16b47c71682d41110909603806d5d76","742a39bfca67e1f14aff6be141ff1584deafff4e","b91d41f240151e02ef8124c8d0136cfe106ca6ea","3af031f4a1a631866bd8c946964d0172ecb24a7e","4c9f9d9e3226a8a4ff5290c3c1bb91df5973a5ec","dc7925c72b9fe127280277d5bc2a127f81ef0494","e11a5e8e9c894269021685a8120875f1147920c9","3bb32626d56b401d0722f3f42ce79da917b50695","fba2f70b13585d76f338378c173c845e034caaff","269f0828d50b3c626e12aac99ba99d2153168ef4","9440714fb9cf5c1153fe9a45db94c9fc57a8c028","e7dcc0890c0e1af16a54babb0862ee6a53c5c3d8","10a3027d2007ba97cb98f264ba31757eeeecde89"],"outCitations":["a281495559d1f3c0a7c877bc12a61118c12430a2","5f73e70e279c9c7e87ce27d49848996e36175580","2934429b9096830d67120f53b65a9bc2391e68dd","4dc0bf36cc81514b705ad1e3b8ec90e4cee5c56a","2457add367bf9b85ffe9fea6d119f25bb3a5ea39","54c2c8e49a1958b29e1bc7dc4b005f3edb04ff35","db91142a3b389d753e943d33bf6caec973a3af30","27ab89cbd0b53a5028eeb5dac44a4c68e8e16a73","a6acc3f85644068d9e0bcc9375d2e5bf47742106","dc511d6606ec3f0c8f3e0664d35a84df3bdf0ed4","f6b7870bed4506c9cc05c6794f969105c3273f70","1edd9ac9ca8cf5bf9d03ebc5b0eee985330d488e","676731b25978d062cca009624879c7b8424d2a58","99cdd7e8ae182a5379c4f62000984b15d9ab9b42","779493f5adff967cd3f5a22d92339ee81b9b6abf","c6fe629f848c38530376e870b6fbe3ae47575696","01c0e6027916aa90b1bad44d2cc53fe86ca4e0df","bfb681b40bc924845fbe076e97f5b542a4e06178","8d4fd5faa628b29c7d7c91467a8d0e80345308ac","642cc971ef21220dfd6c9bae053f325e3fde54c7","cef340d6d25d333ab7d67312723a5685675df04c","022c688852beb8ddfa0f8ffc2954fd38b7b4e141","3ba829496c99d26345450ddd8c2485155bb775e7","611fd7c5501d7691fc0d87d292aec52d9e7da145","715351184a216eacee5946b840a79187e32ae7fe","43c66856becd5f9b0729c6f874b6c85ac21be211","2071278f2dc93cca19f1aa4be563b3e9e749f6a0","aa55686ef03061187e61f0e1f64c86de47aead55","e9a9ee87513d4e6157eed18d1d89bee15e92cfa3","dbd6bdc399f79a2bc8d6e2e36a54cc4856b64c5b","312a9682f4f05fee38ba955b58eaf15af202eb6a","03b1f1bcc389452708b4a3c4afc82c3fec028099","2c2001e49c1edbb2130f5e867bdcce8189b7be0e","f60e0ad1bc72b69bda06eee0191c8e0b2c7c330e","dbe2c345f02fc734f717dc6ea4af6927bf332247","259d63a43a75353be18ce375ea0d86af146b15fc","c5ce21f4bd64e6b456adb47267e0456fc45ae1f3","7bf8125325fbdd99eb215a0c956aad50755cbb5e","ea59f5a5c7f0a09547f9e48ac793da443d81ef47","2523ab5e113d2a6fa0a157eb70cfb7cd96dd262b","f378d29f022ec5fa00f096e653a7f5e3acadb2db","6a70fe20be8375dfe9478ccb8338587d0225e62a"],"year":2017,"s2Url":"https://semanticscholar.org/paper/ade4912fd8eaef703ec102f642554981b618e145","sources":[],"pdfUrls":[],"venue":"","journalName":"Chemical Engineering Journal","journalVolume":"313","journalPages":"1328-1334","doi":"10.1016/J.CEJ.2016.11.024","doiUrl":"https://doi.org/10.1016/J.CEJ.2016.11.024","pmid":"","fieldsOfStudy":["Materials Science"],"magId":"2555052198","s2PdfUrl":"","entities":[]},
{"id":"03babdf3e61730b68ca47c21a0edcdc47e5cba8c","title":"Improved scales of spaces and elliptic boundary-value problems. III","paperAbstract":"We study elliptic boundary-value problems in improved scales of functional Hilbert spaces on smooth manifolds with boundary. The isotropic Hörmander-Volevich-Paneyakh spaces are elements of these scales. The local smoothness of a solution of an elliptic problem in an improved scale is investigated. We establish a sufficient condition under which this solution is classical. Elliptic boundary-value problems with parameter are also studied.","authors":[{"name":"V. A. Mikhailets","ids":["101770011"]},{"name":"A. A. Murach","ids":["100765468"]}],"inCitations":[],"outCitations":[],"year":2007,"s2Url":"https://semanticscholar.org/paper/03babdf3e61730b68ca47c21a0edcdc47e5cba8c","sources":[],"pdfUrls":[],"venue":"","journalName":"Ukrainian Mathematical Journal","journalVolume":"59","journalPages":"744-765","doi":"10.1007/s11253-007-0048-6","doiUrl":"https://doi.org/10.1007/s11253-007-0048-6","pmid":"","fieldsOfStudy":[],"magId":"","s2PdfUrl":"","entities":[]},
{"id":"745e1b5e988e7bd62d3fd6011a6dc74ff63c6976","title":"Surface segregation of impurities (manganese, chromium and calcium) on vacuum annealed 36% Ni-Fe alloy","paperAbstract":"","authors":[{"name":"Michihiko  Inaba","ids":["73451171"]},{"name":"Yoshinori  Honma","ids":["94581425"]},{"name":"Tsutomu  Yamashita","ids":["144612565"]},{"name":"Masashi  Awa","ids":["92220605"]}],"inCitations":["147ae089993f34932a67dda0e1e3d27f65398277","765b05c7ed1345c581b43ada0bdfa5355c7ab372","7ebbaf6528209fa5939ef97457f78bb21a8847f3","cb5a1c555b5252319af3cdb7c5c29ca5556bec21"],"outCitations":["f7f57eb450e44ae2b82e32c4fdb8e55164d83b94","fe4e3f7493f7b92d8f0230773d9a74f6fc264bcc","0a2e537e7c4b70a396afc5dfd58f1d3d2665fc96","565d249e32affbb399736eb403a9c3278f17685b","a437fbaa2c2d5182dd74b7fafa9f3c3d67ae0170","1697b85bf90d998c8c98f3de16ccca7c839ef162","6969dc6cdd6e97e8d07267c3ae5fa54ebbf36250"],"year":1985,"s2Url":"https://semanticscholar.org/paper/745e1b5e988e7bd62d3fd6011a6dc74ff63c6976","sources":[],"pdfUrls":[],"venue":"","journalName":"Journal of Materials Science Letters","journalVolume":"4","journalPages":"818-821","doi":"10.1007/BF00720512","doiUrl":"https://doi.org/10.1007/BF00720512","pmid":"","fieldsOfStudy":["Materials Science"],"magId":"2023093434","s2PdfUrl":"","entities":[]},
{"id":"0ca2b4e22a8a31f19a0dedf3a38549b0e5a9fd5d","title":"[Effect of long-term administration of parotin tablets in gastroptosis].","paperAbstract":"","authors":[{"name":"A  Matsuoka","ids":["2562735"]}],"inCitations":[],"outCitations":[],"year":1973,"s2Url":"https://semanticscholar.org/paper/0ca2b4e22a8a31f19a0dedf3a38549b0e5a9fd5d","sources":["Medline"],"pdfUrls":[],"venue":"Horumon to rinsho. Clinical endocrinology","journalName":"Horumon to rinsho. Clinical endocrinology","journalVolume":"21 6","journalPages":"\n          641-3\n        ","doi":"","doiUrl":"","pmid":"4738809","fieldsOfStudy":["Medicine"],"magId":"2411529736","s2PdfUrl":"","entities":[]},
{"id":"1b571a759554bb98d582dd7bdbfa13292cd11d73","title":"Total lymphoid irradiation and cyclophosphamide as preparation for bone marrow transplantation in severe aplastic anemia","paperAbstract":"A new combination of total lymphoid irradiation and cyclophosphamide was used prior to bone marrow transplantation in an attempt to achieve decreased rejection rates and graft-versus-host disease. Nine previously transfused patients with severe aplastic anemia received marrow from an HLA-identical, MLC-compatible sibling following this preparative regimen. There were no episodes of graft rejection, and only one patient developed graft-versus-host disease. Of the 9 patients, 7 (78%) are surviving with a median follow-up of 400 days. The excellent results of this pretransplant combination of total lymphoid irradiation and cyclophosphamide warrants application of this regimen to a larger series of patients.","authors":[{"name":"N. K. C. Ramsay","ids":["2159012"]},{"name":"T.  Kim","ids":["120986121"]},{"name":"Mark E. Nesbit","ids":["2068612"]},{"name":"W.  Krivit","ids":["5545304"]},{"name":"Peter F. Coccia","ids":["32550299"]},{"name":"Seymour H. Levitt","ids":["4301841"]},{"name":"William G. Woods","ids":["145331322"]},{"name":"J. H. Kersey","ids":["144691543"]}],"inCitations":["cad1ec9b2ab192121c3ca05d7d8bcee1677747c3","827a4361e2a015613f9cc47399cbd7be4db767e0","5861c4d380916b6ad05ba33968ec3825d4bb7a9e","2c9c76fdb5bf56cb72a850a107efd7914762e7fb","a83cfd54a0c10aa9e67358104de2856d1d1e1fb0","6558b0c0c0447f16d263919761818bbff26d1941","4d81ecebbe4d1d9cef809213778f2585ce726137","9f41d8272d990201182e4f78bada34f09a9b4bd7","3d9eb8ee62dc7578a62e7c0c949b4d2f8503b5c1","d291c4011dd3e5896005ae6d1cddc1b1d91c6a3b","ab82df11e2292603f9bd43c058472e505afdca6f","bc76b321e35aa301e9288e0fc47446ade37d69c8","4fa745cfd0e69b3a076784f4109c7e26fbdd0ac5","056b01a83733775220298dd52e89b74006b7980a","ac544054acc8a05f54364c27dd3aa10d5b3caf8b","c86e67e1ae4fe66b6548ab6ccbb463736ee2f943","4aeea7ed999fbcb6df738da68e0b06c95a459490","6677161288edeb27aa802daf0654c1a86f4f3e39","55abff96d54676e2ee5dc97a0a6e09b052dc456e","a68ad23193bae904795363060a59e423708b9a05","b9b807f23b20e25ddfd470babb8ea77d2f7dc489","bc114e2d8963b5f49a89dfa4df1e183065e3b68b","f36433cba8049706a60f93b8ed8cbe2e5baf9e78","33dd82392262440cfe9c037482e70fdcf30401b0","1c9b4bc4e4a89d06c7caf4c567e3905ac7b65c2a","b361314428406b72232482198a29e7da55688e89","b4d1f37719afa209605cdeb9468020f79763ccfc","77c8e6690fdb988299f51531098850eb4e08f123","849cb723d30b0f4ad8ae7a0bfb38e72a0b425033","f7c44db303a3aff86ebaef22de173bd7f425f2f9","a0b631390618b3556c8b973a70ec3d235d8d6be7","7d8d140624787730e16da1ece7983e23ca6c63a8","0017fe550079e07611dc3ff6b46a4fcad461522a","507baca2f7da8d277f1092fd82987bb649a6f504","a4f393b5d8db3995fa35ba56094206020600345d","910a14238101831587078d8cbfe3df45e71f8fd6","b9313ab5cd6627df6a2ed710cb76c37612d79061","198049f0eeff81d98f3c3fcbd645422509dc212d","ce61127d83469f0b20e08296d175cd4b942be87c","98cf11df5bee5c4bf1342e0809f80250cb62f0ca","4fca591aa3ca061882ebe7a75ccad80f94773ac8","047ea3f00fd5a2f20992e1107de9949566796779","4f64f1dca84de89ebec28883ddb6bc70f8eed87a","23d02ce9b539ffe2137368d7ba83a8bd1a6c285a","77db795cb956f01dfed72e6e4a1c366d6918b7f6","f4ee041ee81938fc70afc7190a0cf15f5e8b2595","b302734e62f5065b6cae61620e583c6038134e95","478df63218ebe42b460a39d8cc96cdf2d8235d09","80b25644f26eb6083dcd89c723190989c52025f7","8763f60122ea64fd930e087e3ab6ba4b556e6456","467d0ba73404f52452be30db6842c14796df3d98","c811d0e75057eb7353369124eb7da8c6bf48b490","5134e9f51dd2bce586822e3023732e28cf550288","36fc69ce0cc2899a3e1cb224a5c5a46c67291eef","c8dd882fc02f4aaef0a20781adb11f008e454fcd","d075959e4e7467d0ea95c304ca925fcedd4dde6e","02b9d7b30690db0f5feb5f594fe23e4ee80b0eea","ce40d5239e61b9c6d2bf715c4f8b382cc5f5d1b3","c90c301607975e6974e840caf7776c26443747d5","550fd984e6ed907c4c0ffe567f93782771848c18","e2998916e6f11ba263a3d84497537db704e17c0e","94254d5f5a3b02b27d47e8aa36a592dda150254d","fc6e2bd8df13775fc09949420b5aceb77c2d2c43","4d2e0dd4d76ffae0919f20c87dd6f048bfc3e0c9","e181a0557a59e4badb8af50b9188eba9ea2bb244","38f7cb1aa3e2ed293c8c307d35890122d7849516","e681f93473ce0ffdff5fd52d77b6433640dccbb9","57e72e7aa3f877b220232d62c6323bae96914a20","0ac3cdbf27d5a0c39940c6a5a338ce702cba53f2"],"outCitations":["b7bcd2166a5f54dac3a2501f4d4c65e502ed7fa7","b2686ede056278503f36b1b74f317616fee4946b","0a52383c7614d19137cf46b2c8f768a354b57598","3b9ffc4eb5fc2491d28dff8859b28ef170ba6aad","b8bab9a20b686d04a7b02ceb0a4c6a0f6b9e3ec2","e9178d04460dba1719dbc6fd4aa814e6b46e3699","9f2ab35ac737cce7ae2fce4f66fd7564cce8077d","02947a9d54931b5f2a84b8c6b0a950d604571872","9c9dd140641c64a3966c0890a68a16e6f35db43a","7d73b033feee2088678958916dfda617be55fc1b"],"year":1980,"s2Url":"https://semanticscholar.org/paper/1b571a759554bb98d582dd7bdbfa13292cd11d73","sources":[],"pdfUrls":[],"venue":"","journalName":"Blood","journalVolume":"55","journalPages":"344-346","doi":"10.1182/BLOOD.V55.2.344.BLOODJOURNAL552344","doiUrl":"https://doi.org/10.1182/BLOOD.V55.2.344.BLOODJOURNAL552344","pmid":"","fieldsOfStudy":["Medicine"],"magId":"248822908","s2PdfUrl":"","entities":[]},
{"id":"23258bbdbf4a7b97ba0c783901806fa58ea50ce8","title":"Recent drilling project in Technology Research Center of Japan National Oil Corporation.","paperAbstract":"Drilling Technology in the oil industry is the technology required to drill wells for exploration and production of oil and gas resources. JNOC-TRC's Drilling and Completion Lab. is engaged in research and development (R & D) with three main goals: drilling cost reduction, drilling in challenging frontiers and environmental safety in drilling. This R & D effort also covers the well completion technology needed to produce oil and gas from the wells drilled. R & D has been carried out to date under the three pillars of basic research, large-scale research and specific (applied) research. Recent trends in R & D including horizontal well technology, slim-hole drilling technology and methane hydrate technology will be introduced here.","authors":[{"name":"Takashi  Hatakeyama","ids":["47032844"]},{"name":"Tetsuo  Yonezawa","ids":["67201740"]},{"name":"Akira  Suzuki","ids":["144902755"]}],"inCitations":[],"outCitations":[],"year":1998,"s2Url":"https://semanticscholar.org/paper/23258bbdbf4a7b97ba0c783901806fa58ea50ce8","sources":[],"pdfUrls":[],"venue":"","journalName":"","journalVolume":"","journalPages":"","doi":"10.3720/japt.63.413","doiUrl":"https://doi.org/10.3720/japt.63.413","pmid":"","fieldsOfStudy":["Engineering"],"magId":"2313305098","s2PdfUrl":"","entities":[]},
{"id":"4a61483e0dc27ae37ed3f1d2d30c602b8c4e809e","title":"Investigating the relationship between personality dimensions, level of self-efficacy and perceived performance appraisal satisfaction: a case for individualised performance appraisals","paperAbstract":"1 Investigating the Relationship between Personality Dimensions, Level of Self-Efficacy and Perceived Performance Appraisal Satisfaction: A Case for Individualised Performance Appraisals Jodi Milosevich MLSJOD001 Supervisor: Professor Anton F. Schlechter A dissertation submitted in partial fulfilment of the requirements for the award of the Degree of Master of Commerce in Organisational Psychology Faculty of Commerce University of Cape Town 2019","authors":[{"name":"Jodi  Milosevich","ids":["1580657737"]}],"inCitations":[],"outCitations":["a8649c5999a753c3cca0b24790ca51e08014cd38","eb1a098a3899454f37236c7a9d625ca9b84dda04","6b25d25c5d762804077b88d9bd9485382ad1ae5d","d5a3b8645e784997171d03ca6e8269404e956259","1b1f46e888f4f84cb3c616c8fc2992f04c783a02","0bc2b2a5e9b7fda0b27d7269af297d2d6fed8d8d","cd14d9e1adc5c9271d59783e5198d17195464bcc","e35547b75b95c1f71854ddbe9cc1340ef7a67af0","e9ebc680072e83cbc2452c3fa2bd284630b58c22","4d8a5338042da99819746ff835b6f299135e2023","2a6ba4031f9961e71e2eed5df2bd367e02f8eb77","90ef5e83f60e5ac0e9606dc1003ecd28324a7b90","b8b8d96d54d522086e8df76bb7b056a18817253c","3386cd75704fa307de8aaa609a35a7947aece2ee","4d36a0e4a081d8b9efcefa7e3bf31d3c0a2a56ef","e6b41c52eaa22e51f2fd4e845c4a3cc5d31fdc53","2e9accd64f810f9ae12ab35d905e43ecea35b85a","a19bead1fae7143f82bce6b56ff06bf9a5d57020","0ade9462960eecc87a5a4b6754b8905d150f07bd","120db7223b21a1dddc87c37daa6a96392abbd972","8653b3ff253f532d7b63e20b0c76d2a707dca289","d2f6b569f4115b9da132594d43203c64cb060b5a","28e9e75912c916863730e355235de01049ae84da","f44ea7986671d75157b6ef39f4c0a2531ff17aa7","4d15ab39dc68d05b2891d69b5e85bc332fd6ef09","bb45edf40119fa7194b3ce95a2947f535650f25d","f713d2e05dae8c8370b89bd66669c1b1075aecdd","099ba95be999f75acda3c61b3e0325a658e3f5b7","de9d610a480291bc2bcc87d2b90317b1d6f33d1a","644058d74616bead07ce7c9c331c493a48a6f8ff","796ad233a8c0f3dc06944b8fc12ce5241e61c4e7","09261014109c3b7f000339479c3ab21e1cbc37ff","01cef4edd70a3c83b10727fd227cdb6b7361c101","67904e70061e915cdba8215a392320d195a2f729","2a2700b76ceb06b0bf401bf4364ad5c2c4b67fe2","e5136e9306bf1b0e3d4be0cea384ee9a969a44fa","32a92bd6bffe187d2d4093617cebd6a49ad1c23e","4a32a10c295cf33eb47968ec9e3b8ce68b95b16a","e543088ad0e16836d99d02f9bc8d69133e4f4d9c","43df0f4c36ab0d05316080d2d6839ad1174b20fa","de1c021054bb30f19738e3a70f6d6d8144b6da06","b1e63fcffa0c813a2311fa28040bc8840041c666","0d6a9993c17fe7dd75b0724347855567007c477b","0e03f7e46451b3420c9b16ed45745809a2c5723b","e35413b7e401ab0553e06d8d08df2845f5ca91ae","050f4267cb9fb156fe6441046523ec73fd0510f8","ccfed4d817f223a12e2a500ff98a8b6a147f791d","1777728194cc590d92d1b0993315ed3e8d3c82e0","157e8bbbe613da9d52f0bf4a6648fbe2386aa0a6","a2746dd22aaa790007f9e290dc1ca58c9a05dbcb","2900ffb203fcb22e8027b410754dea7aae6f8a53","44727789e7609f68afd5d165b276179f5ebb9b93","46331b10a85cf8617c9ba99e59416dca410eb70f","1b56f8de0513e791d3aab99e19afc447a5995b60","b66da9a983d3cddab2700b40ca8c8d7cf932b2ca","65ce6078183ea884103d39f2eaa9c7cf1603eb89","bfcd4c7888d159cd382c65e8d57e89f89cfc514b","5e231cc6285ada3d5826c5369174ac7f9b72ffae","cad06e05b9a51073b727e18d0631447fecf02a36","8dd4393cfc8739b65bf443fcbc849896447d7cb2","46465a97ab883cc72d9f601263a208afae6fb31a","81d7af2bc1f769494b2d8820541e48fc1c412c32","ba21d2208a76262e4efef2ab16bee5e6896a6a09","97cce81ca813ed757e1e76c0023865c7dbdc7308","a354854c71d60a4490c42ae47464fbb9807d02bf","59eefbbfede708294463a8de6449b2ffd819c7ea","b4734b08d8e5399757022a530867d6a395430f39","fde2bba63285d238e6e1e9c06a4807e59db4f360","e0bc53f0bc2fa4c611dead19f9bdd3397b8b211d","07f61b051797cf5179561e9e5242de82878db6e0","e8da6923b3b904390424fdc32eea54ee67a2c91a","efa0b764cd46ea3837a08996794e301d5a726a66","4494fa27c80c9511ae6f7ba66317e16a84c487ed","2c2a71188646f648afa966bf1a5c45fc0918ec8e","8beec556fe7a650120544a99e9e063eb8fcd987b","3b9cd92ea8153ed6d733a3cf852b78c0bdc1a6cc","7936bb595550df832b1487439d9a8967ec66f2e6","7cd830c6b2118fbbf1bbd805eea287ef07176aba","d05baf8bb82dcaba1bd1f168cb9a7fcf47a009bf","5dab330a8649f76c261f06eedcacc920605b2bc5","0291936ee7c5337be6f1fa7d32f6203ccec794f9","60aa368d66b8cca2f6247d3fc027476229e0e9b6","062741307fcc854b401db345ac84aebbc150c843","d06f35ed888f5eb322343db69e7e88df7f6f3626","6be5d92ad5f151ccbeb366c5e0f9ade3aa0c3f70","bf82a6359ebe0a2abd48e5b9f7f7a77e99255db7","d9c27745eb716982a861afff197851f9e50ad56d","0ffd137b258bd549fc4a80054a008644e0d7c7f7","9b4ea722767e0121d8f7cb966ce5df98b208e834","41d329ce84b2f9a0061fd3e1eb1fdaf9b40bcfaa","202ec453b7ca560115d24f3485c3f7bcffcf1270"],"year":2019,"s2Url":"https://semanticscholar.org/paper/4a61483e0dc27ae37ed3f1d2d30c602b8c4e809e","sources":[],"pdfUrls":["https://open.uct.ac.za/bitstream/handle/11427/30977/thesis_com_2019_milosevich_jodi.pdf?isAllowed=y&sequence=1"],"venue":"","journalName":"","journalVolume":"","journalPages":"","doi":"","doiUrl":"","pmid":"","fieldsOfStudy":["Psychology"],"magId":"3006670060","s2PdfUrl":"","entities":[]}]

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


    paper_id = request.query_params.get('paper_id', None)
    if paper_id not in dummy_dict:
        return http.HttpResponseBadRequest('Paper not found')

    papers = dummy_data
    similarities = [{'name': sim['name'], 'description': sim['description']} for sim in dummy_similarities]
    tensor = [[[sim['function'](p1, p2) for p2 in dummy_data] for p1 in dummy_data] for sim in dummy_similarities]

    return http.JsonResponse({'tensor': tensor, 
                              'paper': papers,
                              'similarities': similarities})

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
    

