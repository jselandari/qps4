**Readme qPS4**

[https://jselandari.github.io/qps4/](https://jselandari.github.io/qps4/)

**qPS4 · Quick Pediatric Septic Shock Screening Score**

Aplicación web progresiva (PWA) para el cálculo bedside del **qPS4**, un
score rápido de screening de shock séptico pediátrico. Desarrollada para
**AR-UCIP** (Argentina UCIP).

**📋 ¿Qué es el qPS4?**

El **qPS4** (Quick Pediatric Septic Shock Screening Score) es una
herramienta de tamizaje clínico que asigna un puntaje de **0 a 4** según
la presencia de cuatro criterios alterados. Se utiliza para identificar
precozmente a niños con sospecha de shock séptico en la emergencia o
UCIP.

Cada criterio vale **1 punto** si está alterado, **0** si es normal. El
puntaje total es la suma de los cuatro.

**Criterios evaluados**


| Criterio | Score = 0 | Score = 1 |
| :--- | :--- | :--- |
| **Estado mental** | Alerta o Glasgow = 15 | No alerta o Glasgow \< 15 |
| **Frecuencia respiratoria** | ≤ corte para edad | \> corte para edad |
| **TAMSI** (índice de shock) | ≤ corte para edad | \> corte para edad |
| **Relleno capilar** | \< 3 segundos | ≥ 3 segundos |


**Fórmula del TAMSI**

TAMSI = \[FC − 10 × (T° axilar − 37)\] / TAM

-   **FC**: frecuencia cardíaca (latidos/min)

-   **T° axilar**: temperatura axilar en °C

-   **TAM**: tensión arterial media (mmHg)

**Valores de corte por rango etario**
**Frecuencia respiratoria (score = 1 si FR \> corte):**
 
| Edad | Corte |
| :--- | :--- |
| 1 mes -- 11 meses | \> 55 rpm |
| 1 año -- 2 años | \> 47 rpm |
| 3 años -- 5 años | \> 33 rpm |
| 6 años -- 11 años | \> 25 rpm |
| 12 años -- 17 años | \> 21 rpm |


**TAMSI (score = 1 si TAMSI \> corte):**


| Edad | Corte |
| :--- | :--- |
| 1 mes -- 11 meses | \> 2,64 |
| 1 año -- 2 años | \> 2,29 |
| 3 años -- 5 años | \> 1,96 |
| 6 años -- 11 años | \> 1,68 |
| 12 años -- 17 años | \> 1,54 |

**Interpretación orientativa del puntaje total**

| Total | Interpretación |
| :--- | :--- |
| 0 | Sin criterios positivos |
| 1 -- 2 | Screening positivo leve/moderado |
| 3 -- 4 | Screening positivo alto |


**Aviso:** esta interpretación es orientativa. El qPS4 es una
herramienta de tamizaje, no un diagnóstico. La decisión clínica final
siempre es médica.

**🚀 Características de la app**

-   **PWA instalable**: se agrega a la pantalla de inicio del celular
    como una app nativa.

-   **Funciona offline**: gracias al Service Worker, una vez cargada no
    necesita internet.

-   **Cálculo automático del TAMSI**: el usuario solo ingresa FC, TAM y
    temperatura axilar.

-   **Validación en tiempo real**: los puntajes se actualizan a medida
    que se completan los campos.

-   **Reset rápido**: botón para limpiar todos los campos y empezar de
    nuevo.

-   **Diseño responsive**: optimizado para celular, tablet y escritorio.


**📁 Estructura del proyecto**

qps4/

├── index.html → Estructura HTML (sin CSS ni JS embebidos)

├── styles.css → Todos los estilos (paleta ARUCIP)

├── app.js → Lógica de cálculo, eventos y render

├── manifest.json → Configuración PWA (nombre, íconos, colores)

├── sw.js → Service Worker (cache offline)

├── icon-192.png → Ícono 192×192 (generar a partir del logo ARUCIP)

├── icon-512.png → Ícono 512×512 (generar a partir del logo ARUCIP)

└── README.md → Este archivo

**📚 Referencia bibliográfica**

Comparing Screening Tools for Predicting Phoenix Criteria Sepsis and Septic Shock Among Children
Supplemental Table 1a. Score criteria for the quick Pediatric Septic
Shock Screening Score (qPS4). *Pediatrics* 2025. DOI:
[10.1542/peds.2025-071155](https://doi.org/10.1542/peds.2025-071155)

**👥 Créditos**

-   **Desarrollado para**: AR-UCIP · Argentina UCIP

-   **Creadores de ARUCIP**: Jorge Selandari, Eduardo Motto

-   **Colaboradores**: María Laura Flores Tonfi, Carolina Caminiti,
    Débora Farberman

-   **Auspicio**: Fundación Garrahan

**⚠️ Aviso legal**

Esta herramienta es de **apoyo al screening clínico**. No reemplaza el
juicio médico ni la evaluación integral del paciente. Verificá siempre
los valores ingresados y la indicación antes de tomar decisiones
clínicas.

Los autores no pueden garantizar que el programa esté libre de errores o
que, por fallos externos, no ocurran otros. Esta herramienta puede
redirigir a sitios externos, cuya permanencia y exactitud no podemos
responder.

**📬 Comentarios y sugerencias**

Los comentarios, críticas y sugerencias son bienvenidos en:
**arucip.oficial@gmail.com**

*Última actualización: 2026*
