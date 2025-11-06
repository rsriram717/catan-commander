# Catan Commander

A local game assistant for Settlers of Catan that provides strategic recommendations for initial settlement and road placement.

## Project Overview

Catan Commander helps players make optimal initial placement decisions by visualizing the board and analyzing resource probability, hex positioning, and strategic value.

## MVP Scope (Version 1)

**Focus**: Initial game setup only - settlement and road placement recommendations

**Out of scope for v1**:
- Turn-by-turn gameplay tracking
- Resource management during play
- Development cards, trading, robber mechanics
- Multi-turn strategy

**Why this scope**: Building the hex visualization and board configuration system is the foundation. Once we have a robust visual board component and can analyze positions, we can expand to full game tracking.

## Core Requirements

- **Visual hex board** - Interactive display of the Catan board layout
- **Board configuration** - Easy way to input the randomized board setup (resources, numbers, ports)
- **Position analysis** - Calculate value of each settlement location
- **Initial placement recommendations** - Suggest optimal first and second settlement + road placements
- **Local execution** - Runs entirely in browser, no backend needed

## Technology Stack

**Frontend**: React + TypeScript + Vite
**Rendering**: SVG for hex board visualization
**Styling**: Tailwind CSS
**State Management**: React Context or Zustand
**Storage**: LocalStorage (save board configurations)

**Why this stack**:
- React provides component reusability for hex tiles
- SVG enables precise hex rendering with click handlers
- TypeScript ensures type safety for complex board geometry
- Vite offers fast development with HMR

## Architecture Plan

### 1. Board Data Model

```typescript
// Hex coordinates using axial coordinate system
type HexCoordinate = { q: number; r: number }

type ResourceType = 'wood' | 'brick' | 'sheep' | 'wheat' | 'ore' | 'desert'
type PortType = 'wood' | 'brick' | 'sheep' | 'wheat' | 'ore' | 'generic' | null

interface Hex {
  coordinate: HexCoordinate
  resource: ResourceType
  number: number | null  // 2-12, null for desert
  hasRobber: boolean
}

interface Port {
  type: PortType
  // Port location (between two vertices)
  vertices: [VertexCoordinate, VertexCoordinate]
}

// Vertices are where settlements/cities can be placed
// Each vertex touches 3 hexes
type VertexCoordinate = {
  // Derived from surrounding hex coordinates
  hexes: [HexCoordinate, HexCoordinate, HexCoordinate]
}

// Edges are where roads can be placed
// Each edge connects 2 vertices
type EdgeCoordinate = {
  vertices: [VertexCoordinate, VertexCoordinate]
}

interface BoardConfiguration {
  hexes: Hex[]
  ports: Port[]
}

interface PlacementRecommendation {
  vertex: VertexCoordinate
  score: number
  reasoning: {
    expectedResources: number  // resources per 36 rolls
    resourceDiversity: number  // how many different resources (0-5)
    numberQuality: number      // how good the numbers are (6,8 best)
    portAccess: PortType | null
    expansion: number          // potential for future settlements
  }
}
```

### 2. UI Components

**BoardConfigScreen**
- Visual hex grid (standard Catan layout)
- Click each hex to configure:
  - Resource type (wood/brick/sheep/wheat/ore/desert)
  - Number token (2-12)
- Click edges to place ports (type + 2:1 or 3:1)
- Save/load board configurations
- Presets: "Random", "Beginner", "Custom"

**HexBoard** (SVG Component)
- Render 19 hexes in standard layout
- Color-coded by resource type
- Display number tokens
- Show port icons on edges
- Highlight vertices on hover
- Click handlers for configuration mode

**RecommendationPanel**
- Top 5 settlement spots with scores
- Visual highlighting on board
- Detailed breakdown per spot:
  - Expected yield (e.g., "8.3 resources per 36 rolls")
  - Resources accessible (icons)
  - Number probability dots
  - Port access if applicable
- Toggle between "First Settlement" and "Second Settlement" modes

**PlacementMode**
- After board configured, enter placement mode
- "First Settlement" recommendations
- User clicks to place first settlement + road
- "Second Settlement" recommendations (considers first placement)
- User places second settlement + road

### 3. Initial Placement Strategy Engine

**Scoring Algorithm for Settlement Spots**

Each vertex (potential settlement location) is scored based on:

1. **Expected Resource Yield** (40% weight)
   - Sum probability × 1 for each adjacent hex
   - Probabilities: 2/12=1/36, 3/11=2/36, 4/10=3/36, 5/9=4/36, 6/8=5/36
   - Example: Settlement on 6-wood, 8-wheat, 5-ore = (5+5+4)/36 = 14/36 ≈ 0.39 resources per roll

2. **Resource Diversity** (30% weight)
   - 5 different resources = max score
   - 4 different = good
   - 3 different = acceptable
   - 2 different = poor
   - Diversity prevents resource bottlenecks

3. **Number Quality** (15% weight)
   - Penalty for low-probability numbers (2, 3, 11, 12)
   - Bonus for high-probability (6, 8)
   - Balance of number distribution

4. **Port Access** (10% weight)
   - Generic 3:1 port = small bonus
   - Resource-specific 2:1 port = larger bonus
   - Port matching an adjacent resource = highest bonus

5. **Expansion Potential** (5% weight)
   - Number of adjacent vertices for future settlements
   - Number of edges for future roads
   - Strategic choke points

**Second Settlement Considerations**
- Complement first settlement's resources
- Fill gaps in resource production
- Consider synergy (e.g., if first has lots of ore, second needs wood/brick for roads/settlements)
- Account for road placement from first settlement

### 4. Board Configuration Approaches

**Option 1: Click-to-Configure (Recommended for MVP)**
- Render empty hex grid
- Click hex → modal appears with resource and number dropdowns
- Click edge → modal for port type
- Simple, straightforward UX
- Easy to implement

**Option 2: Text Input**
- User enters board as structured text/JSON
- Example format: `A1:wood-6, A2:wheat-8, ...`
- Faster for experienced users
- Could be added as advanced feature

**Option 3: Drag and Drop**
- Draggable resource and number tiles
- Drag onto hex positions
- More visual and intuitive
- More complex to implement (save for v2)

### 5. User Workflow (MVP)

```
1. Configure Board
   ├─ Click "New Board"
   ├─ For each hex: click → select resource + number
   ├─ For each port: click edge → select port type
   └─ Click "Done" to save configuration

2. Get First Settlement Recommendation
   ├─ Algorithm analyzes all 54 vertices
   ├─ Displays top 5 recommendations with scores
   ├─ Highlights positions on visual board
   └─ Shows detailed reasoning for each

3. Place First Settlement
   ├─ User clicks recommended (or any) vertex
   ├─ System records placement
   └─ Prompts for road placement from that settlement

4. Get Second Settlement Recommendation
   ├─ Algorithm re-scores considering first placement
   ├─ Prioritizes complementary resources
   └─ Shows updated recommendations

5. Place Second Settlement + Road
   └─ Complete initial setup

6. (Future) Continue to turn-by-turn gameplay
```

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup (Vite + React + TypeScript + Tailwind)
- [ ] Hex coordinate system utilities
  - [ ] Axial coordinate helpers
  - [ ] Vertex and edge coordinate calculations
  - [ ] Distance and neighbor functions
- [ ] Basic SVG hex rendering
  - [ ] Single hex component
  - [ ] 19-hex standard board layout

### Phase 2: Board Configuration (Week 2)
- [ ] Interactive hex configuration
  - [ ] Click hex to set resource type
  - [ ] Click hex to set number token
  - [ ] Visual feedback (colors, numbers)
- [ ] Port configuration
  - [ ] Identify edge positions
  - [ ] Click to set port type
  - [ ] Render port icons
- [ ] Save/load board to localStorage
- [ ] Board presets (random, beginner board)

### Phase 3: Strategy Engine (Week 3)
- [ ] Vertex enumeration (all 54 settlement spots)
- [ ] Settlement scoring algorithm
  - [ ] Resource yield calculation
  - [ ] Diversity scoring
  - [ ] Number quality scoring
  - [ ] Port access bonus
  - [ ] Expansion potential
- [ ] Sort and rank all positions
- [ ] Second settlement scoring (considers first placement)

### Phase 4: Recommendations UI (Week 4)
- [ ] Recommendation panel component
- [ ] Display top 5 spots with scores
- [ ] Highlight vertices on board
- [ ] Detailed reasoning breakdown
- [ ] Interactive placement mode
  - [ ] Click to place settlement
  - [ ] Click to place road
  - [ ] Update recommendations after first placement

### Phase 5: Polish & Future Expansion
- [ ] Better visual design (colors, icons, animations)
- [ ] Road placement recommendations
- [ ] Mobile responsive design
- [ ] Export/import board configurations
- [ ] Statistics (compare actual vs recommended)

### Future Phases (Post-MVP)
- Turn-by-turn gameplay tracking
- Resource management
- Development cards and special actions
- Multi-player state tracking
- Win condition analysis

## File Structure

```
catan-commander/
├── src/
│   ├── components/
│   │   ├── board/
│   │   │   ├── HexBoard.tsx           # Main SVG board container
│   │   │   ├── Hex.tsx                # Individual hex tile
│   │   │   ├── Vertex.tsx             # Settlement placement point
│   │   │   ├── Edge.tsx               # Road placement edge
│   │   │   └── Port.tsx               # Port indicator
│   │   ├── config/
│   │   │   ├── BoardConfigScreen.tsx  # Board setup interface
│   │   │   ├── HexConfigModal.tsx     # Resource + number picker
│   │   │   └── PortConfigModal.tsx    # Port type picker
│   │   ├── recommendations/
│   │   │   ├── RecommendationPanel.tsx    # Top picks display
│   │   │   ├── SettlementScore.tsx        # Individual score card
│   │   │   └── ReasoningBreakdown.tsx     # Detailed analysis
│   │   └── layout/
│   │       ├── App.tsx                # Main app component
│   │       └── Navigation.tsx         # Mode switching
│   ├── engine/
│   │   ├── scoring.ts             # Settlement scoring algorithm
│   │   ├── recommendations.ts     # Generate top recommendations
│   │   └── probabilities.ts       # Dice probability calculations
│   ├── types/
│   │   ├── board.ts              # Board, Hex, Port interfaces
│   │   ├── coordinates.ts        # Hex, Vertex, Edge coordinate types
│   │   └── recommendations.ts    # Recommendation interfaces
│   ├── utils/
│   │   ├── hexMath.ts            # Axial coordinate system utilities
│   │   ├── geometry.ts           # Vertex/edge calculations
│   │   ├── storage.ts            # LocalStorage helpers
│   │   └── constants.ts          # Board layout constants
│   ├── hooks/
│   │   ├── useBoardConfig.ts     # Board state management
│   │   └── useRecommendations.ts # Recommendation generation
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── claude.md                      # This file
└── README.md
```

## Technical Challenges

### 1. Hex Coordinate System
- Use **axial coordinates** (q, r) for hex positioning
- Convert to pixel coordinates for SVG rendering
- Calculate vertex positions (each vertex touches 3 hexes)
- Calculate edge positions (each edge connects 2 vertices)

### 2. Vertex Identification
- Standard Catan board has 54 possible settlement locations
- Need consistent coordinate system for vertices
- Must handle coastal vertices (touch 2 hexes + water)

### 3. SVG Rendering
- Hex size and spacing calculations
- Clickable regions for hexes, vertices, edges
- Visual highlighting and hover states
- Responsive sizing

### 4. Scoring Complexity
- Accurately model dice probabilities
- Weight multiple factors (yield, diversity, ports, expansion)
- Make adjustments between first and second settlement

## Next Steps to Begin Implementation

1. **Set up project**
   - Initialize Vite + React + TypeScript
   - Configure Tailwind CSS
   - Install any needed libraries

2. **Build hex math utilities**
   - Axial coordinate system
   - Hex-to-pixel conversions
   - Neighbor calculations

3. **Create basic hex visualization**
   - Single hex SVG component
   - 19-hex board layout
   - Color coding by resource

4. **Add configuration mode**
   - Click to set hex resource and number
   - Modal UI for configuration

5. **Implement scoring engine**
   - Calculate all vertex positions
   - Score each position
   - Display recommendations

## Open Questions

1. **Configuration UX**: Should we start with click-to-configure or also support text/JSON input?
2. **Port simplification**: For MVP, should we skip ports or include them?
3. **Road recommendations**: Should first version recommend where to place roads, or just settlements?
4. **Visual style**: Realistic Catan board aesthetic or simplified/modern design?
5. **Multi-player**: Should we track all players' placements or just the user's?
