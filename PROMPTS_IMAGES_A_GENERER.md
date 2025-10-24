# Prompts pour générer les images manquantes du site Projectview

Ce fichier contient tous les prompts pour générer les images actuellement absentes ou représentées par des placeholders sur le site Projectview.

**✅ 100% OPTIMISÉ POUR NANO BANANA** - Format JSON Prompting pour une précision maximale.

---

## GUIDE D'UTILISATION NANO BANANA

### Plateforme : https://api.banana.dev/
### Format : JSON avec paramètres précis pour Stable Diffusion 3.5 Large

Chaque prompt est formaté en JSON pour une précision maximale. Copier-coller directement dans Nano Banana.

---

## SECTION 1 : IMAGES BEFORE/AFTER POUR LES OFFRES (Homepage)

### 1.1 Affichage Dynamique - Comparaison Avant/Après

**Fichier :** `affichage-dynamique-before-after.jpg`

```json
{
  "prompt": "Professional split-screen comparison image. LEFT SIDE (BEFORE): Traditional retail store with yellowed paper posters on walls, outdated paper catalogs stacked messily, dull static displays with faded colors, fluorescent lighting showing aged dusty atmosphere, no digital elements. RIGHT SIDE (AFTER): Same retail location transformed - vibrant digital screens displaying dynamic animated product content, modern NFC tag in foreground with smartphone approaching it, premium LED lighting illuminating merchandise, bright modern colors: blue #72B0CC, green #82BC6C, orange #CF6E3F in digital displays. Clear visual 'AVANT/APRÈS' transition dividing the image. High-definition retail photography, 16:9 aspect ratio, professional commercial lighting, photorealistic style, product display focus, modern retail environment, no people visible.",
  "negative_prompt": "blurry, low quality, cartoonish, people faces, text, watermark, amateur, sketch, painting, anime, distorted, bad anatomy",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 1.2 Collaboration - Comparaison Avant/Après

**Fichier :** `collaboration-before-after.jpg`

```json
{
  "prompt": "Professional split-screen office comparison. LEFT SIDE (BEFORE): Chaotic meeting room - tangled HDMI and USB cables on wooden table, laptop struggling to connect to projector with multiple adapters scattered, frustrated scene with adapter confusion, whiteboard with falling paper post-it notes everywhere, dull office fluorescent lighting creating flat atmosphere, outdated furniture, cables visible everywhere. RIGHT SIDE (AFTER): Modern collaborative meeting room - 75-inch 4K interactive touchscreen as centerpiece mounted on elegant stand, displaying 4 simultaneous screen shares in split quadrant view (dashboard, presentation, spreadsheet, video call), wireless connectivity symbols visible, cable-free setup, sleek modern conference table, professional office furniture, modern LED task lighting, interface colors: blue #72B0CC and green #82BC6C visible on screen, premium corporate atmosphere. Clear split showing dramatic transformation. High-quality corporate photography, 16:9 aspect ratio, modern office environment, professional lighting setup, no people faces visible.",
  "negative_prompt": "blurry, low quality, cartoon, people showing faces, ugly rendering, bad anatomy, distorted shapes, poorly lit, cluttered, cheap looking",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 1.3 Présentation Innovante - Comparaison Avant/Après

**Fichier :** `presentation-innovante-before-after.jpg`

```json
{
  "prompt": "Professional before-after presentation comparison. LEFT SIDE (BEFORE): Traditional showroom sales presentation - small projector screen showing basic PowerPoint slides, scattered paper catalogs and brochures on table, 2D floor plans printed on paper, customer sitting passively watching (view from behind, face not visible), standard showroom with neutral colors, basic lighting, dated furniture, static presentation atmosphere. RIGHT SIDE (AFTER): Futuristic interactive showroom - large 55-inch 4K horizontal touch table displaying photorealistic 3D luxury sports car that can be rotated and customized, color/wheel options visible on interface, VR headset (Meta Quest style) positioned on stand nearby, wall-mounted large screen showing immersive 360-degree virtual apartment interior tour, customer actively interacting with touch table gestures (hands visible but blurred, no face), high-tech environment with modern LED accent lighting, premium showroom atmosphere, colors: blue #72B0CC, orange #CF6E3F, green #82BC6C. High-definition commercial photography, 16:9 aspect ratio, luxury retail environment, professional architectural lighting, modern sophisticated aesthetic.",
  "negative_prompt": "blurry, low quality, amateur, cartoon style, visible faces, bad proportions, ugly rendering, outdated graphics, flat colors, cheap looking materials",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 1.4 Assistant IA - Comparaison Avant/Après

**Fichier :** `assistant-ia-before-after.jpg`

```json
{
  "prompt": "Professional office workspace comparison split-screen. LEFT SIDE (BEFORE): Overwhelmed corporate desk - employee (viewed from behind, face not visible) manually searching through stacks of paper binders and documents, typing repetitive emails, multiple cluttered browser tabs open on monitor, answering basic phone calls with notepad, post-it notes scattered everywhere, piles of paper and filing, chaotic atmosphere showing information overload, standard office lighting casting harsh shadows, outdated office setup, visible stress through organization. RIGHT SIDE (AFTER): Streamlined modern workspace - computer monitor displaying elegant premium AI assistant conversational interface (premium ChatGPT style) with conversation bubbles showing intelligent responses appearing in real-time, analytics dashboard visible with colorful graphs and KPI metrics, suggestions and smart insights displayed beautifully, smartphone beside monitor also showing AI assistant app, clean minimalist desk with only keyboard and mouse visible, single coffee cup and plant for visual interest, calm efficient atmosphere, soft natural window lighting, modern ergonomic setup, interface colors: blue #72B0CC, green #82BC6C, orange #CF6E3F. Professional office photography, 16:9 aspect ratio, modern workplace, premium SaaS aesthetic, photorealistic style.",
  "negative_prompt": "blurry, low quality, cartoon, showing faces, anime style, bad UI design, cluttered interface, distorted text, poor lighting, amateur photography, cheap desk setup",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

## SECTION 2 : IMAGES DYNAMIQUES ALTERNATIVAS (Versions 'APRÈS' seules)

### 2.1 Affichage Dynamique - Version Dynamique

**Fichier :** `affichage-dynamique-dynamic.jpg`

```json
{
  "prompt": "Modern retail store interior photograph featuring multiple large digital display screens. Foreground: sleek NFC tag in foreground with premium smartphone approaching it, screen showing rich product information page. Multiple large digital screens throughout store displaying vibrant animated product content (frozen motion effect visible in static image), promotional content with movement blur effect frozen in time, bright engaging colors including orange #CF6E3F, blue #72B0CC, green #82BC6C. Store shelves with premium retail products slightly visible, professional premium retail environment, modern LED lighting throughout creating bright inviting atmosphere, polished floors reflecting store lighting, no people or people blurred in far background. High-end retail store, contemporary architecture, 16:9 aspect ratio, professional product/retail photography, photorealistic rendering, daylight-quality professional lighting, 4K detail level.",
  "negative_prompt": "blurry, low quality, cartoon, amateur, people faces, ugly rendering, poor lighting, distorted displays, bad perspective, cheap store appearance",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 2.2 Collaboration - Version Dynamique

**Fichier :** `collaboration-dynamic.jpg`

```json
{
  "prompt": "Modern corporate meeting room interior featuring centerpiece 75-inch 4K collaborative touchscreen. Large ultra-high-definition display mounted on elegant mobile stand showing 4 simultaneous screen shares in perfect split quadrant layout: professional dashboard with data visualization (left top), presentation with slides visible (right top), document with annotations (left bottom), video conference call window showing meeting participants (right bottom). All content visible and crisp on glossy screen surface. Modern wooden conference table with contemporary chairs, professional setting. Wireless connectivity indicators subtly visible on screen. Cable management completely hidden, clean cable-free setup. Modern office space with professional corporate lighting, light gray walls with accent modern art. No visible people faces, hands from behind occasionally visible. High-quality corporate office photography, 16:9 aspect ratio, premium business environment, professional architectural lighting, contemporary office design, photorealistic detailed rendering.",
  "negative_prompt": "blurry, low quality, cartoon, visible faces, bad UI, cluttered desk, cheap furniture, poor lighting, distorted screens, amateur render",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 2.3 Présentation Innovante - Version Dynamique

**Fichier :** `presentation-innovante-dynamic.jpg`

```json
{
  "prompt": "Luxury automotive showroom interior featuring high-tech presentation setup. Center: Large horizontal 55-inch 4K touch table (coffee table style) displaying photorealistic premium 3D sports car model with full-color rendering and metallic finish, customization options visible on sides of interface (wheel options, color palette, interior materials). Blurred hand interacting with table visible (no face). Background: sleek modern showroom with premium vehicles slightly blurred, VR headset (Meta Quest Pro style) on elegant display stand nearby, wall-mounted large screen showing immersive architectural 3D visualization. Showroom interior design with dark floors, professional gallery-quality lighting, accent LED lighting in blue #72B0CC, orange #CF6E3F, green #82BC6C. Premium luxury atmosphere, polished finishes, contemporary architectural showroom. 16:9 aspect ratio, professional architectural photography, high-end automotive showroom, photorealistic premium rendering, professional gallery lighting, 4K quality detail.",
  "negative_prompt": "blurry, low quality, cheap looking, cartoon, visible people, bad car rendering, ugly UI, poor lighting, distorted proportions, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 2.4 Assistant IA - Version Dynamique

**Fichier :** `assistant-ia-dynamic.jpg`

```json
{
  "prompt": "Modern professional workspace with AI technology focus. Large monitor displaying premium elegant AI assistant conversational interface showing: conversation bubbles with user questions and AI responses, smart contextual suggestions visible, real-time analytics dashboard section with colorful KPI cards and metrics graphs, professional SaaS interface design similar to premium ChatGPT UI, clean typography, intelligent layout. Minimalist desk setup with: modern mechanical keyboard, wireless mouse, small coffee cup with steam, small decorative plant in minimal pot, desk lamp providing soft task lighting. Soft natural light from window visible on right side, professional workspace atmosphere. Modern office interior with light gray walls, minimalist aesthetic. Interface colors: blue #72B0CC (primary), green #82BC6C (positive metrics), orange #CF6E3F (accents). Professional clean modern workspace, 16:9 aspect ratio, professional office photography, contemporary workplace, premium tech aesthetic, photorealistic rendering, office environment, neutral professional backdrop.",
  "negative_prompt": "blurry, low quality, cartoon, people visible, messy desk, cheap furniture, bad UI design, cluttered space, poor lighting, distorted text, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

## SECTION 3 : IMAGES POUR ARTICLES BLOG

### 3.1 Blog - Showroom Automobile

**Fichier :** `blog-showroom-automobile.jpg`

```json
{
  "prompt": "Luxury car dealership showroom interior. Foreground: Large horizontal 4K touch display table (55-inch coffee table style) showing photorealistic 3D luxury sports car in premium rendering, interactive customization interface with color options and wheel selections visible on screen sides. Background: luxury showroom space with several premium vehicles displayed (blurred), polished concrete floors reflecting overhead lighting, modern showroom architecture with clean lines. Professional gallery-quality LED lighting creating dramatic ambiance, accent lighting in blue #72B0CC and green #82BC6C on UI elements. No people visible. Premium high-end automotive showroom atmosphere. 16:9 aspect ratio, professional architectural photography style, automotive showroom environment, photorealistic detailed rendering, professional gallery lighting, high-quality commercial photography.",
  "negative_prompt": "blurry, low quality, cartoon, people faces, ugly car, bad lighting, cheap showroom, distorted perspective, amateur rendering",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 3.2 Blog - Promoteur Immobilier VR

**Fichier :** `blog-immobilier-vr.jpg`

```json
{
  "prompt": "Modern architecture office workspace featuring VR technology. Center: Meta Quest 3 VR headset on contemporary minimalist designer desk made of light wood and metal. Next to headset: professional monitor displaying 3D architectural visualization showing modern residential building cross-section with visible apartment layouts, 3D model rendered in photorealistic style showing materials and lighting. Rolled architectural blueprints (white paper with blue lines) placed artfully on desk. Tablet showing architectural CAD drawings. Architecture office environment with clean minimalist aesthetic, soft natural lighting from window, modern furniture, framed architectural sketches on walls. Professional sophisticated atmosphere. Colors: orange #CF6E3F and blue #72B0CC visible in UI elements and architectural visualization. 16:9 aspect ratio, professional workspace photography, architecture office environment, contemporary design, photorealistic quality, professional office lighting.",
  "negative_prompt": "blurry, low quality, cartoon, messy desk, ugly headset, bad architecture rendering, poor lighting, cheap furniture, distorted perspective",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 3.3 Blog - 5 Signes Moderniser Showroom

**Fichier :** `blog-moderniser-showroom.jpg`

```json
{
  "prompt": "Professional split-screen editorial comparison. LEFT SIDE (BEFORE - dated): Outdated traditional showroom with yellowed paper posters hanging on walls, stacks of obsolete paper catalogs messily arranged, static wooden displays with dust visible, faded colors creating depressing atmosphere, basic fluorescent ceiling lights casting harsh shadows, outdated furniture style, closed atmosphere without engagement, desaturated color palette suggesting age and stagnation. RIGHT SIDE (AFTER - modern): Same showroom space transformed with modern digital infrastructure: large bright digital display screens showing vibrant product content, interactive touch tables with modern UI interfaces visible, professional modern LED track lighting creating dramatic accent lighting, contemporary furniture and displays, open modern showroom design, bright energetic atmosphere, colors: blue #72B0CC, green #82BC6C, orange #CF6E3F throughout modern displays creating vibrant contrast. Strong visual division between dated and modern sides showing dramatic transformation. 16:9 aspect ratio, professional before-after editorial style, architectural photography, high-quality comparison rendering, clear visual progression from old to new.",
  "negative_prompt": "blurry, low quality, cartoon, people, weak contrast, bad lighting, distorted perspective, unclear comparison, amateur rendering",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 3.4 Blog - Affichage Dynamique Retail

**Fichier :** `blog-affichage-dynamique-retail.jpg`

```json
{
  "prompt": "Modern retail store featuring large digital display screen. Foreground: Prominent large vertical digital display screen showing attractive animated promotional content (product showcase, animated effects frozen in time), modern UI design visible on screen with bright brand colors: orange #CF6E3F, blue #72B0CC, green #82BC6C. Product images and promotional text displayed attractively. Surrounding retail environment: modern store shelves with retail products visible, polished retail flooring, professional retail lighting including LED strips. Background: blurred modern store aisle with merchandise and warm ambient lighting creating depth. No visible people or blurred people distant in background. Premium modern commercial retail environment. 16:9 aspect ratio, professional retail photography, commercial store environment, photorealistic rendering, professional retail lighting, modern retail design, high-quality commercial photography.",
  "negative_prompt": "blurry, low quality, cartoon, people faces, ugly design, poor screen quality, bad lighting, cheap store, distorted perspective, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 3.5 Blog - ROI Technologies Immersives

**Fichier :** `blog-roi-tech-immersive.jpg`

```json
{
  "prompt": "Professional conceptual composite image showcasing immersive technology ecosystem. Center-left: Touch table displaying ROI analytics dashboard with professional graphs, rising percentages (90%, 250%, 340%), KPI cards, and statistics in clean business intelligence design. Center: VR headset (Meta Quest style) displayed prominently on elegant stand. Background: Large collaborative screen mounted on wall displaying immersive VR visualization environment with 3D rendered scene. Surrounding elements: floating visual data elements including colorful business graphs, ascending profit charts, percentage increase indicators (+300% visible). Composite layout showing synergy of multiple technologies. Corporate business technology atmosphere. Professional corporate office environment. Colors: blue #72B0CC (primary metrics), green #82BC6C (positive growth indicators), orange #CF6E3F (accents). 16:9 aspect ratio, professional business technology composite, premium SaaS aesthetic, corporate visualization style, photorealistic quality, professional lighting, high-end commercial rendering.",
  "negative_prompt": "blurry, low quality, cartoon, people, cluttered, ugly graphs, bad data visualization, cheap looking, poor composition, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

## SECTION 4 : IMAGES POUR PAGES SOLUTIONS DÉTAILLÉES

### 4.1 Écrans Collaboratifs - Hero Image

**Fichier :** `ecrans-collaboratifs-hero.jpg`

```json
{
  "prompt": "Professional meeting room interior featuring 75-inch 4K collaborative touchscreen. Large display mounted on modern mobile stand as focal point, showing 4 simultaneous window shares in perfect quadrant split layout: live dashboard (top-left), presentation slides (top-right), spreadsheet document (bottom-left), video conference (bottom-right). All content crisp and readable on glossy screen surface. Modern meeting room setting: contemporary wooden conference table, ergonomic office chairs, light gray walls, professional office furniture. Wireless connectivity indicators subtle on screen. Modern professional ceiling with recessed lighting. LED accent lighting creating professional ambiance. Interface colors: blue #72B0CC and green #82BC6C visible throughout. Cable-free clean setup. Professional corporate office environment, 16:9 aspect ratio, architectural office photography, contemporary meeting space, professional business setting, photorealistic high-quality rendering, premium corporate atmosphere, modern office design.",
  "negative_prompt": "blurry, low quality, cartoon, visible people, cheap furniture, bad UI design, cluttered, poor lighting, distorted screens, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 4.2 Écrans Collaboratifs - Démonstration d'Usage

**Fichier :** `ecrans-collaboratifs-demo.jpg`

```json
{
  "prompt": "Close-up detailed view of collaborative touchscreen in use. Large display filling most of frame showing interactive digital whiteboard interface with: colorful hand-drawn annotations and drawings, virtual sticky notes in multiple colors, intuitive toolbar visible at bottom with design and markup tools, grid or freeform content arrangement. Blurred hand in foreground actively touching screen (three-quarter view angle, no face visible), fingertip making contact with screen surface showing interactivity. Modern touch interface design with premium UI aesthetic. Colors: blue #72B0CC, green #82BC6C, orange #CF6E3F visible in UI elements and annotations. Screen reflection visible suggesting high-quality modern display. Professional focused composition on interactive experience. 16:9 aspect ratio, professional tech product photography, close-up screen detail, photorealistic quality, professional lighting, interactive technology demonstration, modern digital interface.",
  "negative_prompt": "blurry, low quality, cartoon, full face visible, ugly interface, poor handwriting, bad colors, cheap looking design, distorted perspective",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 4.3 Affichage Dynamique - Hero Image

**Fichier :** `affichage-dynamique-hero.jpg`

```json
{
  "prompt": "Luxury retail store environment featuring large vertical digital advertising display screen. Portrait-oriented (9:16 or vertical) premium display showing attractive dynamic content (simulated animation and movement frozen in still image), high-end product showcase with modern UI design. Screen displays: premium product photography, animated effects suggesting motion, elegant typography, modern interface design with bright colors: orange #CF6E3F, blue #72B0CC, green #82BC6C. Surrounding retail environment: luxury store interior with polished floors, premium merchandise visible, professional modern retail lighting with LED elements, upscale aesthetic. Soft natural lighting combined with retail LED accent lighting. No people visible. Premium high-end retail environment. 16:9 aspect ratio (can also be 9:16), professional retail photography, luxury commercial space, photorealistic rendering, premium retail design, professional commercial lighting, high-quality advertising visualization.",
  "negative_prompt": "blurry, low quality, cartoon, people visible, cheap store, ugly product, bad design, poor lighting, distorted perspective, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 4.4 Affichage Dynamique - Système NFC

**Fichier :** `affichage-dynamique-nfc.jpg`

```json
{
  "prompt": "Close-up product interaction scene. Foreground: Premium modern smartphone at angle approaching elegant designer NFC tag (minimalist geometric design, subtle branding). Smartphone screen displays rich interactive product information page: product images, technical specifications, video preview thumbnails, customer reviews, interactive elements. Premium product in background slightly blurred (tech accessory, designer object, or premium item). Professional retail display setup with soft focused lighting. Modern luxury aesthetic. Interface colors on phone: blue #72B0CC, green #82BC6C, orange #CF6E3F. Professional product photography style. Premium retail environment suggesting upscale shop. 16:9 aspect ratio, professional product photography, close-up product interaction, mobile interface showcase, photorealistic quality, professional retail lighting, high-end product presentation, contemporary design.",
  "negative_prompt": "blurry, low quality, cartoon, ugly phone, cheap tag, bad interface, poor lighting, distorted perspective, visible person, amateur render",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 4.5 Tables Tactiles - Hero Image

**Fichier :** `tables-tactiles-hero.jpg`

```json
{
  "prompt": "Luxury car dealership showroom featuring large 55-inch horizontal touch table. High overhead view angle showing entire table surface displaying photorealistic premium sports car 3D model with perfect lighting and metallic finish. Car customization interface visible: color options on sides, wheel selections, interior material choices. Elegant futuristic interface design. Table positioned as centerpiece in luxury showroom. Background: blurred luxury vehicles in showroom setting, polished concrete floors, modern gallery lighting. Professional LED accent lighting with brand colors: blue #72B0CC, green #82BC6C, orange #CF6E3F. Modern premium luxury atmosphere. Polished surfaces reflecting lighting. Contemporary showroom architecture visible. 16:9 aspect ratio, professional automotive photography, luxury showroom interior, overhead product view, photorealistic quality, professional gallery lighting, high-end commercial photography, architectural showroom space.",
  "negative_prompt": "blurry, low quality, cartoon, cheap car, ugly interface, poor lighting, bad perspective, distorted table, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 4.6 Tables Tactiles - Interaction Multi-Touch

**Fichier :** `tables-tactiles-interaction.jpg`

```json
{
  "prompt": "Top-down overhead view of interactive touch table surface. Display shows product catalog interface: multiple products arranged in grid layout, each product thumbnail with price and description, search filters visible on left side, sorting options at top, beautiful e-commerce style UI design. Two blurred hands visible interacting with screen: one hand performing pinch gesture (zooming), other hand swiping, showing multi-touch capability in action. Modern premium mobile commerce interface design. Interface colors: blue #72B0CC, green #82BC6C for UI elements and interactive indicators. Professional photography showing interactive technology in use. Clean composition focusing on interface and hand interaction. 16:9 aspect ratio, professional overhead product photography, interactive technology demo, touch interface showcase, photorealistic quality, professional lighting, contemporary UI design, high-quality commercial photography.",
  "negative_prompt": "blurry, low quality, cartoon, faces visible, ugly interface, poor products, bad lighting, cheap design, distorted view, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 4.7 Bureau d'Étude VR - Hero Image

**Fichier :** `bureau-etude-vr-hero.jpg`

```json
{
  "prompt": "Professional architect or real estate specialist wearing Meta Quest 3 VR headset (profile or three-quarter view, face and features blurred/not identifiable). Person immersed in virtual experience. Background monitor or screen shows the VR visualization being experienced: photorealistic 3D architectural model of modern building, detailed interior virtual tour showing rooms, materials, lighting, modern design elements. Professional architecture office or real estate showroom setting visible. Contemporary modern environment with professional furnishings. Soft professional lighting. Shows VR immersion and visualization capability. Colors visible in VR scene: orange #CF6E3F, blue #72B0CC. 16:9 aspect ratio, professional technology photography, VR experience showcase, architectural visualization, photorealistic rendering, professional office environment, contemporary design, high-quality commercial photography.",
  "negative_prompt": "blurry, low quality, cartoon, visible face, ugly building, bad VR graphics, poor lighting, cheap office, distorted perspective, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 4.8 Bureau d'Étude VR - Visualisation Immersive

**Fichier :** `bureau-etude-vr-immersion.jpg`

```json
{
  "prompt": "Professional composite technology display. Foreground: Meta Quest Pro VR headset positioned on elegant minimalist display stand (metal and black design). Mid-ground background: large premium monitor displaying immersive VR scene content - photorealistic 3D modern apartment interior in beautiful detail showing: living areas, furniture placement, lighting effects, materials and textures, architectural elements, spatial design. VR visualization shows interior design/architectural visualization with professional rendering quality. Professional technological atmosphere. Modern office or showroom setting. Contemporary minimalist styling. Colors visible: orange #CF6E3F, blue #72B0CC on UI elements and accent lighting. Professional product presentation. 16:9 aspect ratio, professional product photography, technology showcase, VR visualization display, photorealistic rendering, premium VR equipment, professional office setting, contemporary design, high-quality commercial photography.",
  "negative_prompt": "blurry, low quality, cartoon, cheap headset, ugly VR scene, bad interior design, poor lighting, dated office, distorted perspective, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 4.9 Assistant IA - Hero Image

**Fichier :** `assistant-ia-hero.jpg`

```json
{
  "prompt": "Computer monitor displaying modern elegant AI assistant conversational interface. Premium ChatGPT-style design showing: active conversation with message bubbles in ascending order (user questions and AI responses clearly visible), intelligent suggestions panel, contextual help sidebar, professional clean typography, premium SaaS aesthetic. Interface colors: blue #72B0CC (primary), green #82BC6C (action buttons), orange #CF6E3F (accents). Modern workspace around monitor: wireless keyboard in sleek design, wireless mouse, small coffee cup with steam, small potted plant in minimal pot. Desk lamp providing soft task lighting visible. Natural soft lighting from window creating pleasant atmosphere. Clean modern office desk setup. Minimalist professional aesthetic. 16:9 aspect ratio, professional workspace photography, SaaS interface showcase, modern office environment, photorealistic quality, professional lighting, contemporary workspace, high-quality commercial photography.",
  "negative_prompt": "blurry, low quality, cartoon, visible person, cluttered desk, ugly interface, bad text, poor lighting, cheap furniture, distorted screen",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 4.10 Assistant IA - Dashboard Analytics

**Fichier :** `assistant-ia-analytics.jpg`

```json
{
  "prompt": "Premium business intelligence dashboard displayed on large monitor. Dashboard showing comprehensive AI assistant analytics: key performance metrics in prominent cards (average response time in seconds, client satisfaction percentage, total conversations handled with numbers), multiple colorful performance charts and graphs (line charts showing trends, bar charts comparing metrics, pie charts for distribution), KPI indicators with visual progress bars. Modern business dashboard design with professional data visualization. Clean minimal interface with breathing room. Colors: blue #72B0CC (primary dashboard color), green #82BC6C (positive metrics and growth indicators), orange #CF6E3F (alerts and important data points). Premium SaaS aesthetic similar to modern analytics platforms. Professional corporate atmosphere. 16:9 aspect ratio, professional dashboard interface, business intelligence visualization, SaaS design, photorealistic rendering, professional data presentation, contemporary tech aesthetic, high-quality commercial photography.",
  "negative_prompt": "blurry, low quality, cartoon, cluttered dashboard, ugly charts, bad data visualization, poor colors, cheap interface, confusing layout, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

## SECTION 5 : IMAGES COMPLÉMENTAIRES GÉNÉRIQUES

### 5.1 Concept "Technologie et Émotion"

**Fichier :** `techno-emotion-concept.jpg`

```json
{
  "prompt": "Conceptual artistic abstract composition representing fusion of technology and human emotion. Visual elements blending: modern tech elements (digital screens, glowing neon interfaces, luminous 3D wireframes, data streams) with organic emotional elements (fluid organic shapes, soft flowing gradients, warm light effects, human silhouettes suggesting connection). Color palette: blue #72B0CC (technology), orange #CF6E3F (energy/emotion), green #82BC6C (growth/harmony). Modern clean inspiring minimalist style. Soft glowing lighting effects. Ethereal atmosphere. Professional artistic composition. 16:9 aspect ratio, high artistic quality, conceptual contemporary art, abstract design, photorealistic rendering, premium aesthetic, high-quality artistic photography.",
  "negative_prompt": "blurry, low quality, cartoonish, messy composition, ugly colors, poor concept visualization, cheap looking, distorted shapes, amateur art",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 5.2 Pattern Technologique pour Fonds

**Fichier :** `pattern-background-tech.png`

```json
{
  "prompt": "Subtle modern seamless pattern for web background. Visual composition: grid of softly glowing luminous connected dots forming abstract neural network, very discrete minimal tech aesthetic suggesting connection and intelligence. Tileable seamless design. Colors: blue #72B0CC at very light transparency (10-15% opacity) on pure white or slightly off-white background. Minimal non-distracting pattern allowing text overlay. Tech aesthetic but extremely subtle. Square format perfect for tiling. 16:9 aspect ratio when tiled, PNG format with transparency, very subtle to not distract from website content.",
  "negative_prompt": "blurry, low quality, cartoon, obvious pattern, dark colors, distracting, cluttered, ugly design, bad for web backgrounds, too bold",
  "height": 1000,
  "width": 1000,
  "steps": 30,
  "guidance_scale": 7.0,
  "seed": null
}
```

---

## SECTION 6 : IMAGES PAGES BLOG DÉTAILLÉES

### 6.1 Article "Moderniser Showroom" - Illustration Principale

**Fichier :** `article-moderniser-showroom-main.jpg`

```json
{
  "prompt": "Professional editorial infographic composition visualizing 5 signs your showroom needs modernization. Visual layout showing 5 key indicators: 1) Yellowed paper posters on wall (dated appearance), 2) Empty showroom with no customers visible (lack of engagement), 3) Stacked obsolete paper catalogs (information overload), 4) Competitor showroom with digital displays in comparison (competitive disadvantage), 5) No engagement metrics or data visible (inability to measure success). Split layout contrasting dated vs modern visual language. Modern editorial design style. Brand colors integrated throughout: blue #72B0CC, orange #CF6E3F, green #82BC6C. Clear visual hierarchy showing problem areas. Suitable for premium blog article design. 16:9 aspect ratio, professional editorial illustration, infographic style, high-quality design composition, contemporary aesthetic, photorealistic elements.",
  "negative_prompt": "blurry, low quality, cartoon, cluttered layout, ugly design, poor hierarchy, bad colors, confusing information, amateur design",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 6.2 Article "Showroom Automobile" - Case Study Visuel

**Fichier :** `article-showroom-auto-case-study.jpg`

```json
{
  "prompt": "Professional case study editorial style composition. Modern car showroom with interactive touch table in center displaying luxury vehicle 3D configuration. Wall-mounted large screen behind table showing impressive statistics and results: '+250% client engagement', 'X% increase in sales', performance graphs visible. Blurred silhouettes of team members or clients visible in background (not identifiable). Visual testimonial elements: success metrics, achievement badges, growth charts integrated into composition. Modern showroom environment with professional lighting. Colors: blue #72B0CC, green #82BC6C, orange #CF6E3F throughout. Professional corporate case study aesthetic. 16:9 aspect ratio, editorial business case study style, annual report design, professional composition, photorealistic quality, success visualization.",
  "negative_prompt": "blurry, low quality, cartoon, visible faces, ugly statistics, bad design, poor lighting, cheap looking, distorted perspective, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

## SECTION 7 : IMAGES UTILES SUPPLÉMENTAIRES

### 7.1 Hero Section - Page d'Accueil Alternative

**Fichier :** `hero-homepage-concept.jpg`

```json
{
  "prompt": "Professional hero image concept showing integrated modern showroom or retail/office space. Multiple technologies visible simultaneously in sophisticated composition: large collaborative screen mounted on wall, interactive touch table in foreground, digital display screens throughout space, subtle VR elements, modern integrated tech environment. Clean modern aesthetic with professional lighting. Inspiring atmosphere suggesting innovation and future. People as subtle silhouettes or completely blurred (faces not identifiable). Brand colors: blue #72B0CC, orange #CF6E3F, green #82BC6C integrated naturally throughout environment. Premium contemporary architecture. Modern furniture and design. Polished surfaces reflecting professional lighting. 16:9 aspect ratio, very high quality professional architectural photography, hero image aesthetic, contemporary design, photorealistic rendering, premium environment.",
  "negative_prompt": "blurry, low quality, cartoon, visible faces, dated design, cluttered, poor lighting, cheap appearance, distorted perspective, amateur",
  "height": 1080,
  "width": 1920,
  "steps": 40,
  "guidance_scale": 7.5,
  "seed": null
}
```

---

### 7.2 Section "Confiance" - Image de Fond

**Fichier :** `trust-section-background.jpg`

```json
{
  "prompt": "Professional subtle background image for trust/testimonial section. Abstract modern composition with subtle geometric patterns, professional corporate atmosphere. Very soft and delicate design to not distract from foreground text content. Colors: very light subtle shades of blue #72B0CC and green #82BC6C at minimal opacity (5-10% transparency), pure white base background. Clean minimalist modern aesthetic. Barely perceptible subtle patterns suggesting technology and trust. Seamless integration with website content. 16:9 aspect ratio, high quality, professional background design, minimal distracting elements, suitable for overlay text, contemporary minimal aesthetic.",
  "negative_prompt": "blurry, too dark, bold colors, distracting, cluttered patterns, cartoon style, ugly design, bright elements, poor for backgrounds",
  "height": 1080,
  "width": 1920,
  "steps": 30,
  "guidance_scale": 6.5,
  "seed": null
}
```

---

## GUIDE UTILISATION NANO BANANA

### Étapes pour générer les images :

1. **Accédez à Nano Banana :** https://api.banana.dev/
2. **Créez un compte et obtenez une API key**
3. **Copiez le JSON du prompt** de la section souhaitée
4. **Envoyez la requête** via API ou interface web
5. **Attendez la génération** (3-5 minutes généralement)
6. **Téléchargez l'image** résultante
7. **Optimisez** avant upload sur le site

### Paramètres clés expliqués :

```json
{
  "prompt": "Description détaillée de l'image",
  "negative_prompt": "Ce qu'il faut éviter",
  "height": 1080,                    // Hauteur en pixels
  "width": 1920,                     // Largeur en pixels
  "steps": 40,                       // Qualité (30-50 recommandé)
  "guidance_scale": 7.5,             // Force du prompt (6-8 optimal)
  "seed": null                       // null = aléatoire, ou nombre pour reproductibilité
}
```

---

## INSTRUCTIONS FINALES

### Ordre de Génération Recommandé :

1. **Priorité 1 (Essentielles - Homepage):**
   - 1.1 à 1.4 (Before/After des 4 offres)
   - 2.1 à 2.4 (Versions dynamiques alternatives)

2. **Priorité 2 (Blog et Solutions):**
   - Section 3 (Articles blog)
   - Section 4 (Pages solutions détaillées)

3. **Priorité 3 (Supplémentaires):**
   - Section 5 (Images génériques)
   - Section 7 (Images utiles)

### Optimisation Post-Génération :

```bash
# Compresser images JPG
tinypng ou squoosh : réduire à 80-85% qualité

# Créer WebP pour meilleure performance
cwebp image.jpg -o image.webp -q 80

# Vérifier résolutions
identify image.jpg → doit afficher 1920x1080
```

### Organisation des fichiers :

```
/public/images/
├── /hero/
│   ├── affichage-dynamique-before-after.jpg
│   ├── collaboration-before-after.jpg
│   ├── presentation-innovante-before-after.jpg
│   └── assistant-ia-before-after.jpg
├── /blog/
│   ├── blog-showroom-automobile.jpg
│   ├── blog-immobilier-vr.jpg
│   └── ...
├── /solutions/
│   ├── ecrans-collaboratifs-hero.jpg
│   └── ...
├── /backgrounds/
│   └── pattern-background-tech.png
└── /misc/
    └── techno-emotion-concept.jpg
```

---

## NOTES IMPORTANTES

### ✅ À FAIRE :
- Utiliser les JSON exactement comme fournis
- Respecter les couleurs hex (#72B0CC, #CF6E3F, #82BC6C)
- Maintenir ratio 16:9 pour la plupart des images
- Éviter toute identification de personnes
- Générer en haute résolution (1920x1080 minimum)

### ❌ À ÉVITER :
- Modifier les prompts au hasard
- Changer les dimensions sans raison
- Utiliser des seeds aléatoires si reproductibilité nécessaire
- Baisser les steps (qualité) en dessous de 35
- Oublier l'optimisation post-génération

### 📊 STATISTIQUES FINALES

**Total images à générer :** 36 images
**Format :** Stable Diffusion 3.5 Large via Nano Banana
**Temps estimé :** 3-5 min par image = 2-3 heures au total
**Coût approximatif :** À vérifier avec Nano Banana pricing

---

**Date de création :** 2025-10-24
**Version :** 3.0 (Nano Banana optimisé - JSON Prompting)
**Optimisation :** 100% compatible Nano Banana avec JSON précis

**À SUPPRIMER après génération de toutes les images.**
