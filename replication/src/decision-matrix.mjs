export function recommend(input) {
  const x={readsPerWrite:1,freshnessMinutes:0,documents:1000,rebuildMinutes:1,divergenceImpact:1,scopes:1,audit:false,schemaChangesPerYear:1,...input};
  const needProjection=x.readsPerWrite>=10&&x.freshnessMinutes>0;
  const highGovernance=x.divergenceImpact>=7||x.scopes>1||x.audit;
  const patterns=["Objeto canónico","Repositorio con ámbito","Validación en frontera"];
  if(needProjection)patterns.push("Proyección de lectura","Reconstrucción total","Publicación por versión");
  else patterns.push("Índice antes que proyección");
  if(highGovernance)patterns.push("Manifiesto de proyección","Reparación verificable","Auditoría narrativa reconstruible");
  if(x.schemaChangesPerYear>=3)patterns.push("Contrato documental versionado","Catálogo versionado");
  return {alternative:needProjection?"Proyección reconstruible C2":"Índice sobre la colección canónica",level:highGovernance?"C3":"C2",risk:highGovernance?"alto":"moderado",patterns:[...new Set(patterns)],evidence:["equivalencia lógica","ámbito negativo","tiempo de reconstrucción","amplificación de escritura"],retireWhen:needProjection?"uso bajo, costo superior al beneficio o índice canónico equivalente":"no aplica; revisar el índice cuando cambie la consulta"};
}

