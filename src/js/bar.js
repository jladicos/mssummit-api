import * as d3 from 'd3'

class Bar {
    constructor(options) {
        /**
         * model: enigma model with a HyperCube to render
         * node: DOM element to render into
         */
        this.model = options.model
        this.node = options.node
        this.width = options.width 
        this.height = options.height
        this.render()
    }

    render() {
        const node = d3.select(this.node)
        
        const svg = node
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("border", "1px solid black")
        
    }
}

export { Bar };