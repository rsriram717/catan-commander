# Catan Commander

An intelligent assistant for Settlers of Catan that helps you make optimal initial settlement and road placements.

## Features

### Board Configuration
- Interactive hex board visualization
- Click any hex to configure its resource type and number token
- Pre-loaded with the standard beginner board layout
- Modern, vibrant visual design

### Settlement Recommendations
- AI-powered analysis of all possible settlement locations
- Scoring algorithm considers:
  - **Expected Resource Yield** (40%) - Resources per 36 rolls
  - **Resource Diversity** (30%) - Number of different resource types
  - **Number Quality** (15%) - Probability of rolling adjacent numbers
  - **Port Access** (10%) - Proximity to trading ports
  - **Expansion Potential** (5%) - Future settlement opportunities

### Interactive Placement
- Visual highlighting of top 5 recommended positions
- Click to place settlements for all players
- Automatic distance rule enforcement (no adjacent settlements)
- Smart second settlement recommendations that complement first placement

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd catan-commander

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5174` (or the next available port).

### Building for Production

```bash
npm run build
```

## How to Use

### 1. Configure Your Board
- The app starts with the standard beginner board layout
- Click any hex to change its resource type and number token
- Click "Start Placement Phase →" when ready

### 2. View Recommendations
- The app analyzes all 54 possible settlement locations
- Top 5 positions are highlighted on the board with ranks (#1-#5)
- Each recommendation shows:
  - Overall score (0-100)
  - Expected resource yield per resource type
  - Score breakdown by category
  - Adjacent number tokens

### 3. Place Settlements
- Click any highlighted vertex to place a settlement
- The app automatically enforces the distance rule
- After first settlement, recommendations update to complement your initial placement
- Players rotate automatically (Red → Blue → Green → Orange)

## Technical Details

### Architecture

**Frontend Stack:**
- React 19 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- SVG for hex board rendering

**Key Components:**
- `HexBoard` - Main SVG board with hexes, vertices, and edges
- `Hex` - Individual hexagon with resource and number display
- `Vertex` - Settlement placement points
- `Edge` - Road placement lines
- `RecommendationPanel` - Top placement suggestions with scores

**Coordinate System:**
- Axial coordinates (q, r) for hex positioning
- Custom vertex identification (3 surrounding hexes)
- Edge coordinates (2 connected vertices)

### Scoring Algorithm

The settlement scoring algorithm in `src/engine/scoring.ts` evaluates each vertex based on:

1. **Resource Yield**: Calculates expected resources using dice probabilities
2. **Diversity**: Rewards settlements touching multiple resource types
3. **Number Quality**: Favors high-probability numbers (6, 8)
4. **Port Access**: Bonuses for 2:1 and 3:1 ports
5. **Expansion**: Considers future settlement opportunities

Second settlement recommendations include complementary resource bonuses.

## Project Structure

```
catan-commander/
├── src/
│   ├── components/
│   │   ├── board/          # Visual board components
│   │   ├── config/         # Configuration UI
│   │   ├── recommendations/ # Recommendation display
│   │   └── layout/         # App shell
│   ├── engine/
│   │   ├── scoring.ts      # Settlement scoring algorithm
│   │   ├── recommendations.ts # Recommendation generation
│   │   └── probabilities.ts   # Dice probability calculations
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Hex math and geometry utilities
│   └── hooks/              # React hooks (future)
├── claude.md               # Project planning document
└── README.md               # This file
```

## Future Enhancements

### Planned Features
- Port configuration in UI
- Road placement recommendations
- Full turn-by-turn gameplay tracking
- Resource management
- Development cards
- Multiple strategy modes (aggressive, defensive, balanced)
- Win probability calculator
- Save/load board configurations
- Mobile responsive design
- Board visualization export

### Future Phases
- Turn tracking and resource production
- Trade recommendations
- Development card strategy
- Multi-player state tracking
- Game analytics and statistics

## Development

### Key Technologies
- **React + TypeScript** for type-safe component development
- **Vite** for fast HMR (Hot Module Replacement)
- **Tailwind CSS** for rapid UI styling
- **SVG** for precise hex rendering with interactivity

### Hex Math
The project uses axial coordinates (q, r) for hex positioning, following the guide at [Red Blob Games](https://www.redblobgames.com/grids/hexagons/).

Key utilities:
- `hexToPixel()` - Convert hex coordinates to screen position
- `getAllVertices()` - Calculate all settlement locations
- `getAllEdges()` - Calculate all road locations
- `vertexToKey()` - Unique identification for deduplication

## Contributing

This is a personal project for learning and Catan strategy. Feel free to fork and adapt!

## License

ISC

## Acknowledgments

- Settlers of Catan by Klaus Teuber
- Hex grid mathematics from Red Blob Games
- React and Vite communities
