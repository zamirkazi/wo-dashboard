import zipfile, re
from xml.etree import ElementTree as ET
NS='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
z=zipfile.ZipFile('fo.xlsx')
shared=[]
if 'xl/sharedStrings.xml' in z.namelist():
    for si in ET.fromstring(z.read('xl/sharedStrings.xml')):
        shared.append(''.join(t.text or '' for t in si.iter(NS+'t')))
def colnum(ref):
    m=re.match(r'([A-Z]+)',ref); n=0
    for ch in m.group(1): n=n*26+ord(ch)-64
    return n-1
rows=[]
for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).iter(NS+'row'):
    cells={}
    for c in row.iter(NS+'c'):
        v=c.find(NS+'v'); isel=c.find(NS+'is')
        if isel is not None: val=''.join(t.text or '' for t in isel.iter(NS+'t'))
        elif v is None: continue
        elif c.get('t')=='s': val=shared[int(v.text)]
        else: val=v.text
        cells[colnum(c.get('r'))]=val
    if cells: rows.append([cells.get(i,'') for i in range(max(cells)+1)])
