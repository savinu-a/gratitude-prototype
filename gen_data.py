"""Generate synthetic, internally consistent demo data for the Gratitude prototype.
Snapshot date: December 2028 (campaign launched at EXMO 2027, June 2027)."""
import json, random, math
from datetime import date, timedelta

random.seed(2027)

DEPTS = [
 dict(id="cse", code="CSE", name="Computer Science & Engineering", short="Computer Science",
      blurb="Software, AI and computing systems for every industry.",
      problem="Machine learning, cloud and security now sit at the centre of the curriculum, but students share a handful of GPUs and an ageing network lab. Final-year research queues for compute time that industry interns take for granted.",
      vision="A department where every student trains models on real hardware, builds products in a studio setting and tests systems against real attacks before they graduate.",
      students=1150, staff=48),
 dict(id="entc", code="ENTC", name="Electronic & Telecommunication Engineering", short="Electronic & Telecom.",
      blurb="Communications, electronics and the hardware behind connected systems.",
      problem="5G, IoT and chip design have moved faster than the department's test equipment. Students learn radio and silicon theory but rarely measure a real antenna or tape out a real design.",
      vision="Open testbeds for wireless, embedded and biomedical electronics where students design, fabricate and measure, not only simulate.",
      students=980, staff=41),
 dict(id="ee", code="EE", name="Electrical Engineering", short="Electrical",
      blurb="Power, energy and electrified transport for a low-carbon Sri Lanka.",
      problem="Sri Lanka's grid is adding solar, storage and electric vehicles quickly. The department's power labs were built for a grid of large thermal plants.",
      vision="Laboratories that let students build and test inverters, chargers and microgrids at realistic power levels.",
      students=860, staff=37),
 dict(id="me", code="ME", name="Mechanical Engineering", short="Mechanical",
      blurb="Design, manufacturing, energy and automation.",
      problem="Industry 4.0 has changed how factories work. Students still learn much of manufacturing on manual machines from earlier decades.",
      vision="A connected manufacturing floor with robots, additive manufacturing and instrumented energy systems that mirror modern industry.",
      students=1020, staff=44),
 dict(id="ce", code="CE", name="Civil Engineering", short="Civil",
      blurb="Structures, water, geotechnics and the built environment.",
      problem="Infrastructure projects now rely on sensors, digital twins and BIM. Testing equipment in key labs predates these methods.",
      vision="Testing and digital-construction facilities that let students instrument structures and model whole projects before a single pile is driven.",
      students=1100, staff=46),
 dict(id="cpe", code="CPE", name="Chemical & Process Engineering", short="Chemical & Process",
      blurb="Process design, bioprocessing and cleaner industry.",
      problem="Process industries are moving to automated, greener operations. Students have limited access to pilot-scale equipment and modern control systems.",
      vision="Pilot plants and control labs where students run real unit operations end to end, safely.",
      students=620, staff=26),
 dict(id="mse", code="MSE", name="Materials Science & Engineering", short="Materials Science",
      blurb="Advanced materials, from minerals to nanostructures.",
      problem="Sri Lanka's mineral resources need local materials expertise to add value. Characterisation work was often sent abroad.",
      vision="In-house characterisation and processing so students and industry can analyse, design and make materials locally.",
      students=480, staff=22),
 dict(id="ere", code="ERE", name="Earth Resources Engineering", short="Earth Resources",
      blurb="Mining, minerals and geospatial engineering.",
      problem="Modern mining depends on safety simulation, mineral processing and remote sensing. Practical exposure has depended on short field visits.",
      vision="Simulation, processing and geospatial labs that bring the mine and the field into the classroom.",
      students=420, staff=19),
 dict(id="tae", code="TAE", name="Textile & Apparel Engineering", short="Textile & Apparel",
      blurb="Textiles, apparel technology and smart materials.",
      problem="Apparel is Sri Lanka's largest industrial export. The industry is automating and moving into smart textiles faster than teaching labs can follow.",
      vision="Automation and smart-textile facilities developed with industry, so graduates walk into modern factories ready to lead.",
      students=540, staff=24),
 dict(id="tlm", code="TLM", name="Transport & Logistics Management", short="Transport & Logistics",
      blurb="Transport systems, logistics and supply-chain engineering.",
      problem="Ports, rail and logistics are being transformed by data and simulation. Students have had few tools to model real networks.",
      vision="Simulation and analytics labs where students model ports, railways and supply chains with live data.",
      students=560, staff=23),
]

# (dept, title, status, sqft, seats, students/yr, summary, equipment list[(item, spec, qty, unit)], software[(...)])
P = []
def proj(d, title, status, sqft, seats, spy, summary, equip, soft=(), extra=()):
    P.append(dict(dept=d, title=title, status=status, sqft=sqft, seats=seats, spy=spy, summary=summary,
                  equip=list(equip), soft=list(soft), extra=list(extra)))

# ---------- CSE
proj("cse","AI & High-Performance Computing Lab","active",1200,48,900,
 "Shared GPU compute for final-year research, machine-learning coursework and industry-sponsored projects. Open to every department.",
 [("GPU compute node","4× data-centre GPU · 512 GB RAM · 2U",3,7200000),
  ("Student workstation","32 GB RAM · RTX-class GPU · 27\" display",24,680000),
  ("All-flash storage array","120 TB usable · NVMe",1,4800000),
  ("UPS and power distribution","40 kVA online UPS with PDUs",1,2650000)],
 [("Cluster scheduler and monitoring licences","3-year subscription",1,1250000)])
proj("cse","Cyber Security & Networks Lab","active",900,36,620,
 "An isolated range where students attack, defend and investigate real networks without touching production systems.",
 [("Enterprise firewall appliances","Next-generation, paired",4,1150000),
  ("Managed core and access switches","Layer 3, 48-port",8,420000),
  ("Rack servers for cyber range","Dual CPU · 256 GB RAM",4,1850000),
  ("Student workstation","32 GB RAM · dual display",36,365000)],
 [("Security tooling and SIEM licences","Academic, 3 years",1,2100000)])
proj("cse","Software Studio & Product Garage","completed",1050,40,700,
 "An agile studio where student teams build and ship products with industry mentors, from first sprint to launch.",
 [("Developer laptops","16-inch · 32 GB RAM",40,345000),
  ("Large-format displays and casting","86-inch interactive",4,690000),
  ("Device test wall","Phones, tablets and wearables",1,1800000)],
 [("Collaboration and design tools","Academic, 3 years",1,950000)])
proj("cse","Robotics & Embedded Systems Lab","active",950,32,540,
 "Hands-on embedded, IoT and robotics work, from microcontrollers to autonomous ground robots.",
 [("Mobile robot platforms","Research-grade, with lidar",8,1450000),
  ("Embedded development kits","MCU, FPGA and SoC boards",60,48000),
  ("Mixed-signal oscilloscopes","4-channel · 500 MHz",8,780000),
  ("Electronics workbenches","ESD-safe with fume extraction",16,165000)])
# ---------- ENTC
proj("entc","5G & IoT Testbed","active",1100,30,560,
 "A private 5G and IoT network on campus for research, coursework and industry trials.",
 [("5G small-cell and core system","Standalone, private network",1,16500000),
  ("Software-defined radios","Wideband, 2×2 MIMO",12,980000),
  ("IoT gateway and sensor kits","LoRa, NB-IoT, Wi-Fi 6",40,62000),
  ("Edge compute servers","GPU-accelerated",2,2400000)])
proj("entc","RF & Antenna Measurement Chamber","in_progress",800,12,380,
 "An anechoic chamber and vector network analysers to design and measure antennas to industry standards.",
 [("Anechoic chamber","Fully shielded, 1–40 GHz",1,28500000),
  ("Vector network analyser","4-port · 26.5 GHz",2,6200000),
  ("Antenna positioner and software","Two-axis",1,4300000)])
proj("entc","Biomedical Electronics Lab","active",700,28,410,
 "Design and test of medical sensors and devices with clinical partners.",
 [("Biosignal acquisition systems","ECG, EEG, EMG",10,520000),
  ("Patient simulators","Multi-parameter",4,690000),
  ("Precision measurement benches","With isolation",14,240000)])
proj("entc","Chip Design & VLSI Studio","active",750,30,450,
 "Industry-standard EDA tools and FPGA prototyping so students can design and verify silicon.",
 [("FPGA prototyping boards","High-end, with transceivers",15,620000),
  ("EDA workstations","64 GB RAM · dual display",30,410000)],
 [("EDA tool licences","University programme, 3 years",1,6800000)])
# ---------- EE
proj("ee","EV & Power Electronics Lab","active",1000,30,520,
 "Inverters, chargers and battery systems for electric vehicles, tested at realistic power levels.",
 [("Regenerative grid simulator","90 kVA",1,9800000),
  ("Battery cycler and emulator","8-channel",1,7400000),
  ("DC fast-charger test rig","60 kW",1,6200000),
  ("Power electronics workbenches","Isolated, with protection",15,380000)])
proj("ee","Smart Grid & Renewable Energy Lab","active",1300,32,600,
 "A laboratory microgrid with solar, storage and real-time simulation for grid studies.",
 [("Real-time digital simulator","With hardware-in-the-loop",1,18500000),
  ("Rooftop solar array and inverters","30 kWp",1,7800000),
  ("Battery energy storage system","50 kWh",1,8600000),
  ("Smart meters and protection relays","IEC 61850",20,185000)])
proj("ee","High Voltage Lab Upgrade","completed",1600,24,480,
 "Modernised impulse and AC test sets and safety systems for the high-voltage laboratory.",
 [("Impulse voltage generator upgrade","800 kV",1,14200000),
  ("Partial discharge measurement system","Digital",1,4600000),
  ("Safety interlocks and earthing","Full laboratory",1,3100000)])
# ---------- ME
proj("me","Robotics & Automation Cell","active",1400,24,640,
 "A flexible manufacturing cell with industrial robots, vision and PLCs, set up like a modern factory line.",
 [("Six-axis industrial robots","10 kg payload",4,6900000),
  ("Collaborative robots","5 kg payload",4,3600000),
  ("Machine vision systems","Smart cameras",6,640000),
  ("PLC and conveyor training line","Modular",1,7200000)])
proj("me","Advanced Manufacturing & 3D Printing Hub","completed",1150,30,820,
 "Metal and polymer additive manufacturing with design workstations, open to every department.",
 [("Metal 3D printer","Laser powder bed fusion",1,19500000),
  ("Industrial polymer printers","SLS and FDM",4,2350000),
  ("3D scanners","Structured light",2,1450000)])
proj("me","Thermo-fluids & Energy Lab","active",1000,28,560,
 "Instrumented rigs for heat transfer, refrigeration and renewable energy systems.",
 [("Instrumented heat-exchanger rigs","Multi-configuration",4,1650000),
  ("Refrigeration and heat-pump trainers","Data-logged",4,1380000),
  ("Wind tunnel upgrade","Open-circuit, PIV-ready",1,7400000)])
proj("me","Automotive Engineering Lab","active",1250,24,480,
 "Engine and chassis dynamometers and EV drivetrain rigs for automotive research.",
 [("Chassis dynamometer","Four-wheel, 300 kW",1,16800000),
  ("EV drivetrain test rig","Motor and inverter",1,6400000),
  ("Vehicle diagnostic systems","OEM-grade",6,520000)])
# ---------- CE
proj("ce","Smart Structures & Testing Lab","active",2000,30,760,
 "Large-scale structural testing with sensors and digital-twin monitoring.",
 [("Servo-hydraulic actuator system","500 kN, multi-actuator",1,26500000),
  ("Strong floor and reaction frame","Upgrade",1,9800000),
  ("Structural health monitoring kits","Wireless sensors",10,850000)])
proj("ce","Geotechnical Lab Modernisation","active",1100,30,700,
 "Automated triaxial, consolidation and in-situ test equipment for modern geotechnics.",
 [("Automated triaxial systems","Stress-path",3,4200000),
  ("Automated consolidation systems","Oedometer bank",6,980000),
  ("Field testing equipment","CPT and in-situ kit",1,5600000)])
proj("ce","Water & Environmental Engineering Lab","in_progress",900,28,520,
 "Water-quality analysis and hydraulic models for climate-resilient water systems.",
 [("Hydraulic flume","10 m tilting, wave maker",1,9400000),
  ("Water-quality analysers","ICP and TOC",2,4600000)])
proj("ce","BIM & Digital Construction Studio","completed",800,40,900,
 "Building information modelling, drones and VR for planning and managing construction.",
 [("BIM workstations","64 GB RAM · pro GPU",40,320000),
  ("Survey drones","RTK mapping",2,1650000),
  ("VR review station","Room-scale",2,780000)],
 [("BIM software licences","Campus programme, 3 years",1,2600000)])
# ---------- CPE
proj("cpe","Process Simulation & Control Lab","active",850,32,480,
 "Distributed control systems and process simulators that mirror modern plants.",
 [("Distributed control system","Training plant",1,9600000),
  ("Simulation workstations","Dual display",32,330000)],
 [("Process simulation licences","Academic, 3 years",1,3400000)])
proj("cpe","Bioprocess Pilot Plant","in_progress",1300,20,360,
 "Pilot-scale fermenters and downstream processing for food, pharmaceutical and bio-based industries.",
 [("Pilot fermenters","50 L and 200 L, sterilisable",2,8900000),
  ("Downstream processing skid","Centrifuge, filtration",1,9200000),
  ("Clean utilities","Steam, clean water",1,5400000)])
proj("cpe","Green Energy & Biofuels Lab","active",800,24,380,
 "Biomass conversion, biofuel synthesis and emissions testing for a cleaner industry.",
 [("Pyrolysis and gasification reactors","Bench-scale",2,3600000),
  ("Gas chromatography system","With mass spectrometer",1,8700000),
  ("Emissions analyser","Portable",1,2100000)])
# ---------- MSE
proj("mse","Advanced Materials Characterisation Suite","completed",1000,16,640,
 "Electron microscopy and X-ray analysis so materials can be characterised locally rather than abroad.",
 [("Scanning electron microscope","With EDS",1,21500000),
  ("X-ray diffractometer","Powder and thin film",1,11800000),
  ("Sample preparation suite","Cutting, polishing, coating",1,2900000)])
proj("mse","Nanomaterials Lab","active",750,18,320,
 "Synthesis and analysis of nanomaterials from Sri Lankan graphite and minerals.",
 [("Tube furnaces and CVD system","Up to 1600 °C",2,3900000),
  ("Particle size and zeta analyser","Laser",1,6200000),
  ("Glovebox","Inert atmosphere",1,4800000)])
proj("mse","Ceramics & Glass Processing Lab","active",900,20,300,
 "Forming, firing and testing of advanced ceramics and glass from local minerals.",
 [("High-temperature kilns","Up to 1700 °C",2,3200000),
  ("Isostatic press","Cold",1,5600000),
  ("Mechanical test frame","Universal, 100 kN",1,4100000)])
# ---------- ERE
proj("ere","Mineral Processing Lab","active",1000,24,300,
 "Crushing, grinding, flotation and separation for Sri Lanka's minerals.",
 [("Crushing and grinding circuit","Lab-scale",1,6800000),
  ("Flotation cells","Automated",3,1650000),
  ("Magnetic and gravity separators","Set",1,4900000)])
proj("ere","Mine Safety & Ventilation Simulator","active",700,20,260,
 "Immersive simulation of underground mining, ventilation and emergency response.",
 [("Immersive mine simulator","Projection and controls",1,12400000),
  ("Gas detection training kits","Multi-gas",10,260000)],
 [("Ventilation modelling software","Academic, 3 years",1,1900000)])
proj("ere","Remote Sensing & GIS Lab","completed",650,30,520,
 "Satellite, drone and GIS tools for geology, mining and environmental monitoring.",
 [("GIS workstations","32 GB RAM · dual display",30,310000),
  ("Survey drone with multispectral camera","RTK",1,2900000),
  ("GNSS receivers","Survey-grade",4,980000)],
 [("GIS and image-processing licences","Campus, 3 years",1,1600000)])
# ---------- TAE
proj("tae","Smart Textiles Studio","active",800,24,340,
 "Conductive yarns, wearable electronics and functional fabrics developed with industry.",
 [("Digital knitting machine","Computerised flat-bed",1,9800000),
  ("Embroidery and conductive-yarn system","Multi-head",1,3600000),
  ("Wearables prototyping kits","Sensors and controllers",20,95000)])
proj("tae","Apparel Automation Line","active",1400,30,420,
 "Automated cutting, sewing and inspection set up the way modern factories run.",
 [("Automated cutting system","CAD-linked",1,12400000),
  ("Programmable sewing stations","Automated units",10,820000),
  ("Vision-based inspection","AI defect detection",1,3900000)])
proj("tae","Textile Testing Lab","completed",700,20,380,
 "Physical and chemical testing to international standards for students and industry.",
 [("Tensile and burst testers","Textile-grade",2,2400000),
  ("Colour-matching spectrophotometer","With software",1,2900000),
  ("Conditioning chamber","Climate-controlled",1,3200000)])
# ---------- TLM
proj("tlm","Logistics Simulation Lab","active",750,32,420,
 "Port, warehouse and fleet simulation with live operational data.",
 [("Simulation workstations","32 GB RAM",32,300000),
  ("Warehouse automation demonstrator","Conveyors and AGV",1,6200000)],
 [("Discrete-event simulation licences","Academic, 3 years",1,2800000)])
proj("tlm","Intelligent Transport Systems Lab","active",900,28,380,
 "Traffic sensing, signal control and transport-network modelling for Sri Lankan cities.",
 [("Traffic signal controllers","Adaptive",4,1150000),
  ("Roadside sensors and cameras","AI-enabled",12,380000),
  ("Driving simulator","Motion base",1,9600000)])
proj("tlm","Supply Chain Analytics Studio","completed",600,30,460,
 "Data analytics and planning tools for supply-chain decisions.",
 [("Analytics workstations","32 GB RAM · dual display",30,290000),
  ("Collaboration displays","75-inch",3,520000)],
 [("Planning and analytics licences","Academic, 3 years",1,2200000)])
proj("tlm","Railway Engineering Lab","active",1000,24,300,
 "Track, signalling and rolling-stock models for Sri Lanka's railway modernisation.",
 [("Signalling and interlocking trainer","Relay and electronic",1,7800000),
  ("Track geometry measurement kit","Trolley-based",1,4600000),
  ("Railway operations simulator","Control-room",1,6400000)])

dept_counter = {}
projects = []
for p in P:
    d = p["dept"]; dept_counter[d] = dept_counter.get(d, 0) + 1
    code = f'{d.upper()}-{dept_counter[d]:02d}'
    pid = f'{d}-{dept_counter[d]:02d}'
    boq = []
    for (it, spec, q, u) in p["equip"]:
        boq.append(dict(cat="Equipment", item=it, spec=spec, qty=q, unit=u))
    for (it, spec, q, u) in p["soft"]:
        boq.append(dict(cat="Software", item=it, spec=spec, qty=q, unit=u))
    eq = sum(b["qty"]*b["unit"] for b in boq if b["cat"]=="Equipment")
    net = round(max(650000, eq*0.045), -4)
    boq.append(dict(cat="Network & power", item="Structured cabling, electrical and data points", spec=f'{p["sqft"]:,} sq ft', qty=1, unit=net))
    fit = round(p["sqft"]*random.choice([5200,5600,5900,6300]), -4)
    boq.append(dict(cat="Interior", item="Fit-out, partitions, flooring and ceiling", spec=f'{p["sqft"]:,} sq ft', qty=1, unit=fit))
    ac = round(p["sqft"]*random.choice([1700,1850,2000]), -4)
    boq.append(dict(cat="Interior", item="Air conditioning and ventilation", spec="Inverter, ducted", qty=1, unit=ac))
    furn = round(p["seats"]*random.choice([52000,58000,64000]), -4)
    boq.append(dict(cat="Interior", item="Furniture and storage", spec=f'{p["seats"]} seats', qty=1, unit=furn))
    sub = sum(b["qty"]*b["unit"] for b in boq)
    maint = round(sub*0.06, -4)
    boq.append(dict(cat="Maintenance", item="Three-year maintenance and calibration", spec="Service contracts", qty=1, unit=maint))
    total = sum(b["qty"]*b["unit"] for b in boq)
    projects.append(dict(id=pid, code=code, dept=d, title=p["title"], status=p["status"], sqft=p["sqft"], seats=p["seats"],
                         students=p["spy"], summary=p["summary"], boq=boq, target=total))

# funding levels
for pr in projects:
    if pr["status"] in ("completed", "in_progress"):
        pr["goal_pct"] = 1.0
    else:
        pr["goal_pct"] = round(random.uniform(0.12, 0.82), 2)
# featured CSE-01 fixed near 64%
projects[0]["goal_pct"] = 0.64

FIRST_M = ["Ruvin","Kasun","Dinesh","Chamara","Pradeep","Nuwan","Lahiru","Sanjaya","Tharindu","Asanka","Mahesh","Roshan","Isuru","Dilan","Chathura","Supun","Janaka","Ravindu","Harsha","Sameera","Nalin","Upul","Gayan","Malith","Anuradha","Thilina","Sachith","Buddhika","Prasad","Kavindu"]
FIRST_F = ["Ishara","Nadeesha","Dilini","Sachini","Anusha","Chathurika","Hasini","Tharushi","Nimali","Piumi","Kaushalya","Sewwandi","Iresha","Madhavi","Thilini","Shanika","Rashmi","Dulani","Hiruni","Nethmi"]
LAST = ["Perera","Fernando","Silva","Jayasinghe","Wickramasinghe","Gunawardena","Rathnayake","Bandara","Dissanayake","Herath","Senanayake","Weerasinghe","Karunaratne","Abeysekera","Wijesinghe","Jayawardena","Ranasinghe","Samarasinghe","Gamage","Liyanage","Peiris","Kumara","Ekanayake","Amarasinghe","Weeratunge","Dasanayake","Wanniarachchi","Hettiarachchi","Pathirana","Rajapaksha","Munasinghe","Kodikara","Edirisinghe","Seneviratne","Kulatunga","Navaratne","Sivakumar","Rajendran","Thambiah","Mohamed","Cassim","Fonseka","de Mel","Goonetilleke"]
COMPANIES = ["Coralline Technologies (Pvt) Ltd","Lumen Power Systems","Harbourline Logistics","Apex Structural Consultants","Meridian Bank PLC","Brightpath Robotics","Fieldstack Technologies","Northgate Apparel Group","Sapphire Minerals Ltd","Kelani Process Industries","Studio Ratnayake","Tidewater Shipping Agencies","Granite Holdings PLC","Vertex Semiconductor Lanka","Ceylon Grid Solutions","Arcwell Engineering","Bluewave Telecom","Orchid Textiles (Pvt) Ltd","Summit Construction Ltd","Lotus Software Labs"]
CHAPTERS = ["UoM Alumni Association, Australia","UoM Alumni, United Kingdom","UoM Alumni, North America","UoM Alumni, Singapore","UoM Alumni, Qatar"]
DEPT_ABBR = {d["id"]: d["code"] for d in DEPTS}

donors = []
def new_person():
    female = random.random() < 0.32
    fn = random.choice(FIRST_F if female else FIRST_M)
    ln = random.choice(LAST)
    title = random.choices(["Eng.","Dr.","Prof.","Mr.","Ms." if female else "Mr."],[40,14,4,30,12])[0]
    if female and title=="Mr.": title="Ms."
    year = random.choice(range(1978, 2021))
    dept = random.choice(DEPTS)["id"]
    return dict(name=f"{title} {fn} {ln}", type="individual", batch=year, dept=dept)

def new_donor(kind):
    if kind=="individual": d = new_person()
    elif kind=="batch":
        y = random.choice(range(1980, 2016)); dept = random.choice(DEPTS)["id"]
        d = dict(name=f"Batch of {y}", type="batch", batch=y, dept=dept, members=random.randint(22,95))
    elif kind=="company":
        d = dict(name=random.choice(COMPANIES), type="company", batch=None, dept=None)
    elif kind=="chapter":
        d = dict(name=random.choice(CHAPTERS), type="chapter", batch=None, dept=None)
    else:
        d = dict(name="A grateful graduate", type="anonymous", batch=None, dept=None)
    # dedupe companies/chapters/batches by name
    for ex in donors:
        if ex["name"]==d["name"] and d["type"] in ("company","chapter","batch"):
            return ex
    d["id"] = f"d{len(donors)+1:04d}"
    donors.append(d)
    return d

TIER_AMTS = [(10000,30),(25000,22),(50000,18),(100000,12),(250000,9),(500000,5),(750000,2),(1000000,4),(2000000,2),(5000000,1)]
def rand_amt():
    a = random.choices([t[0] for t in TIER_AMTS],[t[1] for t in TIER_AMTS])[0]
    return a

START = date(2027,6,14); END = date(2028,12,10)
def rand_date(a=START, b=END):
    return a + timedelta(days=random.randint(0,(b-a).days))

pledges = []
for pr in projects:
    goal = round(pr["target"]*pr["goal_pct"], -3)
    raised = 0
    end = END
    if pr["status"]=="completed": end = date(2028,4,30)
    if pr["status"]=="in_progress": end = date(2028,9,30)
    # anchor gifts
    anchors = []
    if goal > 8_000_000:
        anchors.append(("company", min(goal*random.uniform(0.18,0.32), 15_000_000)))
        anchors.append(("batch", min(goal*random.uniform(0.08,0.18), 12_500_000)))
    elif goal > 2_000_000:
        anchors.append((random.choice(["batch","company"]), goal*random.uniform(0.15,0.3)))
    for kind, amt in anchors:
        amt = round(amt, -5)
        dn = new_donor(kind)
        pledges.append(dict(donor=dn["id"], project=pr["id"], amount=amt, date=rand_date(START,end).isoformat()))
        raised += amt
    while raised < goal:
        r = random.random()
        kind = "individual" if r<0.84 else ("anonymous" if r<0.92 else ("chapter" if r<0.96 else "batch"))
        amt = rand_amt()
        if kind=="chapter": amt = random.choice([500000,1000000,1500000,2500000])
        if kind=="batch": amt = random.choice([750000,1000000,2000000,3200000])
        if raised + amt > goal:
            amt = max(10000, round(goal - raised, -3))
            if pr["status"] not in ("completed","in_progress") and amt < 10000: break
        dn = new_donor(kind) if (kind!="individual" or random.random()<0.85 or not donors) else random.choice([x for x in donors if x["type"]=="individual"] or [new_donor("individual")])
        if dn["type"]=="individual" and dn.get("dept") and random.random()<0.6:
            dn["dept"] = pr["dept"]
        pledges.append(dict(donor=dn["id"], project=pr["id"], amount=amt, date=rand_date(START,end).isoformat()))
        raised += amt
    pr["raised"] = raised

# general fund pledges
for _ in range(40):
    dn = new_donor("individual" if random.random()<0.9 else "anonymous")
    pledges.append(dict(donor=dn["id"], project="general", amount=rand_amt(), date=rand_date().isoformat()))

# completed project legacy details
LEG = {
 "mse-03": None,
}
handovers = {}
for pr in projects:
    if pr["status"]=="completed":
        final = round(pr["target"]*random.uniform(0.93,0.99), -4)
        hd = date(2028, random.randint(2,11), random.randint(3,26))
        pr["legacy"] = dict(handed_over=hd.isoformat(), final_cost=final,
            students_served=int(pr["students"]*random.uniform(0.9,1.15)),
            courses=random.randint(4,14), papers=random.randint(2,19), startups=random.randint(0,3),
            industry_projects=random.randint(3,16))
    if pr["status"]=="in_progress":
        pr["progress_note"] = random.choice(["Procurement complete · installation under way","Fit-out under way · equipment arriving","Equipment installed · commissioning"])
        pr["expected"] = random.choice(["Feb 2029","Mar 2029","Apr 2029"])

pledges.sort(key=lambda x: x["date"], reverse=True)

# derived dept totals
for d in DEPTS:
    ps = [p for p in projects if p["dept"]==d["id"]]
    d["target"] = sum(p["target"] for p in ps)
    d["raised"] = sum(p["raised"] for p in ps)
    d["img"] = f'img/{d["id"]}.webp'

meta = dict(campaign="EXMO 2027 · Transform the Campus", snapshot="December 2028",
            target=sum(p["target"] for p in projects), raised=sum(p["raised"] for p in projects)+sum(x["amount"] for x in pledges if x["project"]=="general"),
            givers=len(donors), pledges=len(pledges))

data = dict(meta=meta, depts=DEPTS, projects=projects, donors=donors, pledges=pledges)
def intify(o):
    if isinstance(o,float) and o.is_integer(): return int(o)
    if isinstance(o,dict): return {k:intify(v) for k,v in o.items()}
    if isinstance(o,list): return [intify(v) for v in o]
    return o
data=intify(data)
open("lib/gratitude.json","w",encoding="utf-8").write(json.dumps(data, separators=(",",":"), ensure_ascii=False))
print(meta)
for d in DEPTS: print(d["code"], f'{d["target"]:,}', f'{d["raised"]/d["target"]:.0%}')
print("statuses", {s: sum(1 for p in projects if p["status"]==s) for s in ("active","in_progress","completed")})
print("types", {t: sum(1 for x in donors if x["type"]==t) for t in ("individual","batch","company","chapter","anonymous")})
