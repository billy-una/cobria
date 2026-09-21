# Procedencia y neutralización arquitectónica

| Referencia | Observación | Adaptación COBRIA |
|---|---|---|
| [BSHandball](https://github.com/billy-una/BSHandball) | módulos de servidor y dominio compartido muestran separación creciente por capacidades | preferir módulos verticales con dominio compartido explícito y fronteras comprobables |
| [CRMHotel](https://github.com/billy-una/CRMHOTEL) | estructura `domainLayer`, `logicLayer`, `dataLayer`, `presentationLayer`, Daters y repositorios | separar intención, modelo, traducción física, acceso y presentación sin conservar nombres por obligación |
| [POS Guápiles](https://github.com/billy-una/posguapiles) | capas de lógica, datos y presentación, además de operación offline/proveedores | declarar puertos para conectividad y evitar que offline/proveedor filtre al dominio |

Estas observaciones sirven como antecedentes de diseño. No se afirma que cada proyecto
implemente perfectamente las reglas COBRIA ni que la estructura de carpetas pruebe por sí
sola separación de responsabilidades. Los SHA y licencias exactos siguen bajo fase 0.

