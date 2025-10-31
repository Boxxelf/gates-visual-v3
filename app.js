document.addEventListener('DOMContentLoaded', () => {

    // --- Setup SVG and Dimensions ---
    const svg = d3.select("#chart");
    const container = d3.select(".chart-container");
    
    // Get actual dimensions from the container
    const containerRect = container.node().getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    
    // Set SVG dimensions
    svg.attr("width", width).attr("height", height);

    const tooltip = d3.select(".tooltip");

    // --- Rationale Panel Selectors ---
    const rationaleDisplay = d3.select("#rationale-display");
    const rationaleTitle = d3.select("#rationale-title");
    const rationaleLevel = d3.select("#rationale-level");
    const rationaleContent = d3.select("#rationale-content");
    const instructions = d3.select("#instructions"); // <-- NEW: Select the instructions panel
    
    // --- Clear selection/highlight on SVG background click ---
    svg.on('click', resetGraphView);

    // --- Setup Force Simulation ---
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(70))
        .force("charge", d3.forceManyBody().strength(-250))
        .force("center", d3.forceCenter(width / 2, height / 2));

    let link, node, label;
    let allEdges = []; // To store all edges for neighbor finding

    // --- Load Data and Initialize Graph ---
    d3.json("graph_data.json").then(graph => {
        allEdges = graph.edges; // Store edges

        // Create links
        link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.edges)
            .enter().append("line")
            .attr("class", "link");

        // Create nodes
        node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(drag(simulation)); // Add drag behavior

        // Add circles to nodes
        node.append("circle")
            .attr("r", 8)
            .attr("class", d => d.calc_level.replace(/\s+/g, '-').toLowerCase() === 'calculus-i' ? 'node-circle calc-i' : 'node-circle calc-ii');

        // Add labels to nodes
        label = node.append("text")
            .text(d => d.id) // Show ID by default
            .attr("x", 12)
            .attr("y", 3)
            .attr("class", "node-label");

        // --- Interaction Events ---
        node.on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            // Show SIMPLE tooltip (just the name)
            tooltip.html(`<strong>${d.label}</strong>`) 
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
        })
        
        .on("click", (event, d_clicked) => {
            event.stopPropagation(); // Prevent SVG click from firing
            
            // 1. Show Rationale in Sidebar
            showRationale(d_clicked);

            // 2. Find all neighbors
            const neighborIDs = new Set();
            neighborIDs.add(d_clicked.id); // Add the clicked node itself

            allEdges.forEach(edge => {
                if (edge.source.id === d_clicked.id) {
                    neighborIDs.add(edge.target.id);
                } else if (edge.target.id === d_clicked.id) {
                    neighborIDs.add(edge.source.id);
                }
            });

            // 3. Apply classes
            // Highlight clicked node
            node.classed("selected", n => n.id === d_clicked.id);
            // Fade all nodes NOT in the neighbor set
            node.classed("faded", n => !neighborIDs.has(n.id));
            
            // Fade all links that are NOT between two nodes in the neighbor set
            link.classed("faded", l => {
                return !(neighborIDs.has(l.source.id) && neighborIDs.has(l.target.id));
            });
        });

        // --- Connect Simulation to Elements ---
        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.edges);

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        }
    }).catch(error => {
        console.error("Error loading graph data:", error);
    });

    // --- Rationale Panel Functions ---
    function showRationale(d) {
        rationaleTitle.text(d.label);
        rationaleLevel.text(d.calc_level);
        rationaleContent.html(""); // Clear old content

        // Get categories that have rationales
        const categoriesWithRationales = Object.keys(d.rationales || {});

        if (categoriesWithRationales.length === 0) {
            rationaleContent.append("p").text("No specific rationales available for this topic.");
        } else {
            categoriesWithRationales.forEach(category => {
                // Add category title
                rationaleContent.append("h5").text(category);
                
                // Add rationale items
                const items = d.rationales[category];
                items.forEach(item => {
                    const itemDiv = rationaleContent.append("div")
                        .attr("class", "rationale-item");
                    
                    itemDiv.html(`<strong>${item.cs_topic}:</strong> ${item.rationale}`);
                });
            });
        }
        
        rationaleDisplay.classed("hidden", false);
        instructions.classed("hidden", true); // <-- UPDATED: Hide instructions
    }

    // This function now resets highlights AND hides the panel
    function resetGraphView() {
        node.classed("selected", false);
        node.classed("faded", false);
        link.classed("faded", false);
        rationaleDisplay.classed("hidden", true);
        instructions.classed("hidden", false); // <-- UPDATED: Show instructions
    }


    // --- Drag Functionality ---
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // --- Filter Functionality ---
    const filterButtons = d3.selectAll('.filter-btn');
    
    filterButtons.on('click', (event) => {
        const btn = d3.select(event.currentTarget);
        const filterType = btn.attr('data-filter-type');
        const filterValue = btn.attr('data-filter-value');
        
        // Update button active state
        filterButtons.classed('active', false);
        btn.classed('active', true);
        
        // Reset any highlights before applying filter
        resetGraphView(); 

        // Apply filter
        if (filterType === 'all') {
            node.classed('faded', false);
            link.classed('faded', false);
        } else {
            // Apply fade to nodes
            node.classed('faded', d => {
                if (filterType === 'cs_categories') {
                    return !d.cs_categories.includes(filterValue);
                }
                if (filterType === 'calc_level') {
                    return d.calc_level !== filterValue;
                }
                return false;
            });

            // Helper to check if a node is faded by the filter
            const isNodeFilteredOut = (nodeData) => {
                if (filterType === 'cs_categories') {
                    return !nodeData.cs_categories.includes(filterValue);
                }
                if (filterType === 'calc_level') {
                    return nodeData.calc_level !== filterValue;
                }
                return false;
            };

            // Apply fade to links
            link.classed('faded', l => {
                // Fade link if EITHER end is filtered out
                return isNodeFilteredOut(l.source) || isNodeFilteredOut(l.target);
            });
        }
    });

});