# A simple http server that transpiles JSX into JS

This is great for legacy projects which transpile javascript
using a non-nodejs environment, but you'd still like to add
React+JSX support for your developers.

Example usage from a non-nodejs build system (Java) could look something like:

```java
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.util.EntityUtils;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;

import org.json.JSONObject;
//  ...

    final static private HttpClient httpClient = new DefaultHttpClient(new ThreadSafeClientConnManager());

    public final String compile(String jsxSourceCode,
                                String jsxSourceName) throws JSXTranspileException, IOException {

        JSONObject request = new JSONObject();
        request.put("sourceName", jsxSourceCode);
        request.put("sourceCode", jsxSourceName);
        HttpPost post = new HttpPost("http://localhost:4443");
        post.setHeader("Content-Type", "application/javascript");
        post.setEntity(new StringEntity(request.toString(), "application/json", StandardCharsets.UTF_8.name()));
        HttpResponse httpResponse = httpClient.execute(post);
        StatusLine statusLine = httpResponse.getStatusLine();
        String data = EntityUtils.toString(httpResponse.getEntity());
        if (200 == statusLine.getStatusCode()) {
            // here is your transpiled JSX
            return data;
        }
        // data here, contains the unmolested error text from babel
        // and is returned as text/plain in a status 500 response
        throw new JSXTranspileException(data);
    }
// ...
```

You could quickly stand up the transpile server via something like this:

```shell
$ npx pm2 start jsx-babel-http.js
```
