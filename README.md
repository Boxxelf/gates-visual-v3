# Calculus Topics Flow Chart for Computer Science

An interactive visualization showing the relationships between Calculus topics and their applications in Computer Science fields.

## Live Demo

**[View the Interactive Chart](https://boxxelf.github.io/gates-visual-v3/)**

## Features

- **Interactive Graph Visualization**: Explore calculus topics and their prerequisites using a force-directed graph
- **Smart Filtering**: Filter topics by CS category (Machine Learning, Algorithms, AI, Computer Graphics) or Calculus level (I or II)
- **Detailed Information**: Click on any topic to see:
  - Full topic description
  - Related CS applications
  - Rationales for why this topic matters in CS
- **Visual Design**: 
  - Blue nodes = Calculus I topics
  - Green nodes = Calculus II topics
  - Arrows show prerequisite relationships

## How to Use

1. **Explore Topics**: Hover over nodes to see topic names
2. **View Details**: Click on a node to see detailed information and highlight related topics
3. **Filter**: Use the left sidebar to filter by CS field or Calculus level
4. **Rearrange**: Drag nodes to reorganize the layout
5. **Reset**: Click on the background to reset the view

## Technologies Used

- **D3.js** (v7): For interactive data visualization
- **HTML5/CSS3**: Modern web standards
- **JavaScript (ES6+)**: Interactive functionality

## Project Structure

```
gates_vis_1020/
├── index.html          # Main HTML page
├── style.css           # Styling and layout
├── app.js              # JavaScript logic and D3.js visualization
├── graph_data.json     # Calculus topics data with relationships
└── README.md           # This file
```

## Data Structure

The `graph_data.json` file contains:

- **Nodes**: Each calculus topic with:
  - `id`: Short identifier
  - `label`: Full topic name
  - `calc_level`: "Calculus I" or "Calculus II"
  - `cs_categories`: Array of relevant CS fields
  - `rationales`: Detailed explanations of CS applications

- **Edges**: Prerequisites/follow-up relationships between topics

## Customization

### Adding New Topics

Edit `graph_data.json`:

```json
{
  "nodes": [
    {
      "id": "NEW_ID",
      "label": "Topic Name",
      "calc_level": "Calculus I",
      "cs_categories": ["Machine Learning"],
      "rationales": {
        "Machine Learning": [
          {
            "cs_topic": "Application Name",
            "rationale": "Why this matters..."
          }
        ]
      }
    }
  ],
  "edges": [
    {"source": "PREREQUISITE_ID", "target": "NEW_ID"}
  ]
}
```

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Feel free to:
- Add more calculus topics
- Enhance the visualizations
- Improve the UI/UX
- Fix bugs

## Contact

For questions or suggestions, please open an issue on GitHub.

---

