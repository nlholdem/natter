from elasticsearch import Elasticsearch
import base64
import requests

es = Elasticsearch()

print (es.cat.health())

url = 'http://www.cbu.edu.zm/downloads/pdf-sample.pdf'
url1 = 'http://www.webpages.uidaho.edu/envs501/downloads/Mitchell%201989.pdf'
response = requests.get(url)

newfile = open("test2.rtf")
rtfData = newfile.read()

rtfData1 = base64.b64encode(rtfData)

data = base64.b64encode(response.content).decode('ascii')
result1 = es.index(index='testing', doc_type='pdf', pipeline='attachment',
                  body={'data': data})

#result2 = es.index(index='testing', doc_type='rtf', pipeline='attachment',
#                  body={'data': rtfData1})

print (result1)
#print (result2)