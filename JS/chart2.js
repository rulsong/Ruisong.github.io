d3.csv("Data/forbes_2022_billionaires.csv").then((data) => {
  data.forEach((d) => (d.age = +d.age));
  data = data.filter((d) => d.age <= 35);

  console.log("data==>", data);

  const bar_chart = d3.rollups(
    data,
    (d) => d.length,
    (d) => d.country
  );
  bar_chart.sort((a, b) => (a[1] > b[1] ? -1 : 1));

  d3.json("Data/world.json").then((map_data) => {
    console.log("data==>", map_data);
    d3.csv("Data/names.csv").then((names) => {
      new Bar("bar", bar_chart, names, map_data);
      new MapChart("map", names, map_data, null);
    });
  });
});

// bar

// map

class ParentChart {
  constructor(id, data) {
    this.data = data;
    this.div = id;
  }

  add_svg() {
    this.add_margin();
    this.add_chart_area();
  }

  add_margin() {
    const div = d3.select(`#${this.div}`);
    div.selectAll("*").remove();
    this.getWH(div);
    this.margin = { left: 60, right: 0, top: 30, bottom: 50 };
    this.innerW = this.width - this.margin.left - this.margin.right;
    this.innerH = this.height - this.margin.top - this.margin.bottom;
    this.svg = div
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
  }

  add_chart_area() {
    this.ChartArea = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    this.draw_area = this.ChartArea.append("g");
    this.AxisYLeft = this.ChartArea.append("g");
    this.AxisYRight = this.ChartArea.append("g").attr(
      "transform",
      `translate(${this.innerW},0)`
    );
    this.AxisX = this.ChartArea.append("g").attr(
      "transform",
      `translate(0,${this.innerH})`
    );
  }
  add_label() {
    this.ChartArea.selectAll(".x_label")
      .data([0])
      .join("text")
      .attr("class", "x_label")
      .attr("transform", `translate(${this.innerW / 2},${this.innerH + 30})`)
      .text(this.x_field);
    // y1
    this.ChartArea.selectAll(".y_label")
      .data([0])
      .join("text")
      .attr("class", "y_label")
      .attr("transform", `translate(10,0) rotate(90)`)
      .text(this.y_field);
  }

  add_axis() {
    this.x && this.AxisX.transition().delay(200).call(d3.axisBottom(this.x));
    this.y && this.AxisYLeft.transition().delay(200).call(d3.axisLeft(this.y));
  }

  tips_show(e, v, html) {
    d3.select(".d3-tip")
      .style("display", "block")
      .style("position", "absolute")
      .style("top", e.pageY + 10 + "px")
      .style("left", e.pageX + 10 + "px")
      .style("padding", "5px")
      .html(html);
  }
  tips_hide() {
    d3.select(".d3-tip").style("display", "none");
  }
  update_chart() {
    this.update_data();
    this.add_scale();

    this.add_axis();
    this.draw_chart();
  }

  getWH(node) {
    this.width = node.node().getBoundingClientRect().width;
    this.height = node.node().getBoundingClientRect().height;
  }

  setZoom() {
    let x = this.x;
    const zoomed = (e) => {
      console.log(e);
      let t = e.transform;
      // 重新设置xscale
      this.x = t.rescaleX(x);
      this.AxisX.call(d3.axisBottom(this.x));
      // 下面画图
    };

    let extent = [
      [this.margin.left, this.margin.top],
      [this.innerW, this.innerH],
    ];
    this.zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .extent(extent)
      .translateExtent(extent);
    this.svg.call(this.zoom);
    this.zoom.on("zoom", zoomed);
  }
}

class Bar extends ParentChart {
  constructor(id, data, names, map_data) {
    super(id, data);
    this.names = names;
    this.map_data = map_data;
    this.x_field = "Country";
    this.y_field = "Number";
    super.add_svg();
    super.update_chart();
    this.add_label();
  }

  add_scale() {
    d3.select("body")
      .append("div")
      .style("display", "none")
      .attr("position", "absolute")
      .attr("class", "d3-tip");

    this.domain = this.data.map((d) => d[0]);
    this.x = d3
      .scaleBand()
      .domain(this.domain)
      .range([0, this.innerW])
      .padding(0.2);
    this.y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d[1]) * 1.5])
      .range([this.innerH, 0]);
    this.color = d3
      .scaleOrdinal()
      .domain(this.domain)
      .range(d3.schemeTableau10);
  }
  update_data() {}

  draw_chart() {
    let g = this.ChartArea.append("g");
    let rects = g
      .selectAll("rect")
      .data(this.data)
      .join("rect")
      .attr("class", "barect");

    rects
      .attr("x", (d) => this.x(d[0]))
      .attr("y", (d) => this.y(d[1]))
      .attr("width", this.x.bandwidth())
      .attr("height", (d) => this.innerH - this.y(d[1]));
    rects.attr("fill", (d) => this.color(d[0]));

    rects
      .on("mouseenter", (e, d) => {
        let html = ` <p> ${d[0]} :${d[1]}  </p>`;
        this.tips_show(e, d, html);
      })
      .on("mouseout", this.tips_hide)
      .on("click", (e, d) => {
        new MapChart("map", this.names, this.map_data, d[0]);
      });
    this.svg.on("click", (e, d) => {
      if (e.target.nodeName !== "rect") {
        new MapChart("map", this.names, this.map_data, null);
      }
    });

    this.add_text();
  }

  add_text() {
    let g = this.ChartArea.append("g");
    let text = g
      .selectAll("text")
      .data(this.data)
      .join("text")
      .attr("class", "textbar");

    text
      .attr("x", (d) => this.x(d[0]) + this.x.bandwidth() / 2 - 6)
      .attr("y", (d) => this.y(d[1]) - 10)
      .text((d) => d[1]);
  }
}

class MapChart extends ParentChart {
  constructor(id, data, world, select_country) {
    super(id, data);
    this.data = this.data.filter((d) => d.country === select_country);
    this.x_field = "NOC";
    this.y_field = "Num_of_record";
    this.select_country = select_country;
    this.world = world;
    super.add_svg();
    super.update_chart();
  }

  add_scale() {
    let noc_data = d3.rollups(
      this.data,
      (d) => d.length,
      (d) => d[this.x_field]
    );

    this.color = d3
      .scaleSequential()
      .domain(d3.extent(noc_data, (d) => d[1]))
      .range(["green", "blue"]);
  }
  update_data() {
    // this.world.features.forEach((d) => {
    //   let values = this.data.find((v) => d.id === v[this.x_field]);
    //   if (values) {
    //     d[this.y_field] = +1;
    //   } else {
    //     d[this.y_field] = 0;
    //   }
    // });
  }

  draw_chart() {
    this.initMap();

    let color = this.color;
    let mapPath = this.map
      .append("g")
      .attr("class", "map")
      .selectAll("path")
      .data(this.world.features)
      .join("path")
      .attr("d", (d) =>
        d.properties.name === "Bermuda" ? "M 0,0" : this.path(d)
      );

    this.svg.style("background-color", "#1b4087");

    mapPath
      // .attr("fill", "white")
      .attr("fill", "white")
      .attr("stroke", "red")
      .attr("stroke-width", 1);
    // .attr("class", (d) => d.properties.name);

    this.add_image();
  }

  initMap() {
    let world = _.cloneDeep(this.world);
    let features = _.cloneDeep(this.world.features);
    this.select_country
      ? (features = features.filter(
          (d) => d.properties.admin === this.select_country
        ))
      : null;
    world.features = features;
    this.projection = d3
      .geoMercator()
      .fitSize([this.width, this.height], world)
      .clipExtent([
        [0, 20],
        [this.width, this.height],
      ]);
    // .scale(this.height /2 )
    // .translate([this.width / 2, this.height / 2 + 100]);

    this.path = d3.geoPath().projection(this.projection);
    this.map = this.svg.append("g").attr("class", "map");
    this.legend = this.map
      .append("g")
      .attr("transform", `translate(${this.width - 150},0)`);
  }

  add_image() {
    let imageSize =20;
    let imageUrl = () => "img/avatar/Hu Kunhui.jpeg";
    const clipPath = this.svg
      .append("defs")
      .lower()
      .append("clipPath")
      .attr("id", "circle-clip")
      .append("circle")
      .attr("r", imageSize / 2)
      .attr("cx", imageSize / 2)
      .attr("cy", imageSize / 2);

    let avatars = this.map
      .append("g")
      .attr("class", "avatar")
      .selectAll("image")
      .data(this.data)
      .join("image")
      .attr("class", "avatar");
    //     <foreignObject width="100%" height="100%">
    //   <div xmlns="http://www.w3.org/1999/xhtml">
    //     <img src="img/avatar/Hu Kunhui.jpeg" width="40" height="40" />
    //   </div>
    // </foreignObject>
    avatars
      .attr("x", (d) => this.projection([+d.lng, +d.lat])[0]  )
      .attr("y", (d) => this.projection([+d.lng, +d.lat])[1])
      .attr("width", imageSize)
      .attr("height", imageSize)
      // .attr("clip-path", "url(#circle-clip)")
      .attr("xlink:href", (d) =>'img/avatar/' + d.name+'.jpeg');

    avatars
      .on("mouseenter", (e, d) => {
        let html = ` 
                  <li>${d.name}</li>
                  <li>${d.country}</li>
        `;
        this.tips_show(e, d, html);
      })
      .on("mouseout", this.tips_hide);
  }
}
