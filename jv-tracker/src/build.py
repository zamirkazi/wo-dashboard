#!/usr/bin/env python3
"""Assemble the Canyon Woods capital desk dashboard from replies.json + recipients.txt."""
import json, datetime, pathlib
here = pathlib.Path(__file__).parent
data = json.loads((here/'data_fragment.js').read_text()[len('const D='):-1])
data['generatedAt'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
html = (here/'head.html').read_text() + 'const D=' + json.dumps(data, separators=(',',':')) + ';\n' \
     + (here/'tail.html').read_text()
out = here/'index.html'
out.write_text(html)
print('wrote', out, len(html), 'bytes ·', len(data['replies']), 'replies ·', data['generatedAt'])
