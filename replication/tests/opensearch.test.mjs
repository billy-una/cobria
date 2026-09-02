import test from "node:test";
import assert from "node:assert/strict";
import { OpenSearchAdapter } from "../src/adapters/opensearch-adapter.mjs";

test("OpenSearch pagina listados mayores que diez mil documentos", async () => {
  let searches = 0;
  const fetchImpl = async (url, options = {}) => {
    if (url.endsWith("/_refresh")) return new Response("{}", { status: 200 });
    if (url.endsWith("/_search")) {
      searches++;
      const body = JSON.parse(options.body);
      const start = body.search_after ? 10000 : 0;
      const hits = Array.from({ length: start ? 2 : 10000 }, (_, index) => ({
        sort: [start + index], _source: { payload: { id: `doc-${start + index}`, scope: "sur" } }
      }));
      return new Response(JSON.stringify({ hits: { hits } }), { status: 200 });
    }
    return new Response("{}", { status: 200 });
  };
  const adapter = new OpenSearchAdapter({ url: "http://search", fetchImpl });
  const values = await adapter.list("canonical", "sur");
  assert.equal(values.length, 10002);
  assert.equal(searches, 2);
});
