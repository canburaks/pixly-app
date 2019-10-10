from wikidata.client import Client
client = Client()  # doctest: +SKIP

entity = client.get('Q2001', load=True)