import Database from "better-sqlite3";
import path from "path";

const dbPath =
  process.env.DATABASE_URL?.replace(/^file:/, "") ||
  path.join(process.cwd(), "dev.db");

// Ensure parent directory exists
const dir = path.dirname(dbPath);
import fs from "fs";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

console.log("Seeding database...");

// Always update source/section for existing sample articles
const sampleUpdate = db.prepare("UPDATE Article SET source = 'Sample', section = 'Pre-loaded' WHERE source IS NULL").run();
if (sampleUpdate.changes > 0) console.log(`Updated source for ${sampleUpdate.changes} sample articles.`);

// Check if already seeded
const existing = db.prepare("SELECT COUNT(*) as cnt FROM Article").get() as { cnt: number };
if (existing.cnt > 0) {
  console.log("Database already seeded, skipping.");
  db.close();
  process.exit(0);
}

function cuid() {
  return (
    "c" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 9)
  );
}

function now() {
  return new Date().toISOString();
}

// Article 1: Environmental Science
const a1 = cuid();
db.prepare(`INSERT INTO Article (id, title, titleCn, content, translation, difficulty, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
  a1, "The Impact of Climate Change on Global Biodiversity", "气候变化对全球生物多样性的影响",
  `Climate change is widely recognized as one of the most significant threats to global biodiversity. As global temperatures continue to rise, ecosystems around the world are experiencing unprecedented changes that affect the survival and distribution of countless species.

Scientists have observed that many species are shifting their geographic ranges toward the poles or to higher elevations in response to warming temperatures. For example, marine species in the North Atlantic have moved northward by an average of 30 kilometers per decade over the past fifty years. Similarly, alpine plants in European mountain ranges have migrated uphill at rates of up to 4 meters per decade.

The timing of biological events, known as phenology, has also been disrupted. Spring events such as flowering, leaf emergence, and bird migration are occurring earlier in many regions. This can create mismatches between species that depend on each other. For instance, if insects emerge earlier due to warm temperatures but the birds that feed on them have not yet arrived from their winter migration, both species may suffer.

Coral reefs, which support approximately 25 percent of all marine life, are particularly vulnerable to climate change. Rising ocean temperatures cause coral bleaching, a process in which corals expel the symbiotic algae that provide them with nutrients. If high temperatures persist, the corals eventually die. The Great Barrier Reef in Australia has experienced multiple mass bleaching events since 2016, resulting in the loss of over half of its coral cover in some areas.

The loss of biodiversity has serious implications for human well-being. Ecosystems provide essential services such as clean water, pollination of crops, and carbon storage. The economic value of these services has been estimated at trillions of dollars annually. Protecting biodiversity is therefore not just an environmental concern but also an economic and social imperative.

Conservation efforts are underway globally, including the establishment of protected areas, restoration of degraded habitats, and captive breeding programs for endangered species. However, scientists argue that these measures alone are insufficient without addressing the root cause: the rapid reduction of greenhouse gas emissions.`,
  `气候变化被广泛认为是全球生物多样性面临的最重大威胁之一。随着全球气温持续上升，世界各地的生态系统正在经历前所未有的变化，这些变化影响着无数物种的生存和分布。

科学家观察到，许多物种正在将其地理分布范围向极地或更高海拔地区转移，以应对气温升高。例如，过去五十年来，北大西洋的海洋物种平均每十年向北移动30公里。同样，欧洲山脉的高山植物以每十年高达4米的速度向上迁移。

被称为物候学的生物事件的时间规律也被打乱了。春季事件如开花、长叶和鸟类迁徙在许多地区提前发生。这可能在相互依赖的物种之间造成不匹配。例如，如果昆虫因温暖天气而提前出现，但以它们为食的鸟类尚未从冬季迁徙中归来，两个物种都可能受到损害。

珊瑚礁支撑着大约25%的海洋生物，特别容易受到气候变化的影响。海洋温度上升导致珊瑚白化，这是一个珊瑚驱逐为其提供营养的共生藻类的过程。如果高温持续，珊瑚最终会死亡。自2016年以来，澳大利亚大堡礁经历了多次大规模白化事件，导致某些区域超过一半的珊瑚覆盖消失。

生物多样性的丧失对人类福祉有着严重影响。生态系统提供清洁水源、作物授粉和碳储存等基本服务。这些服务的经济价值估计每年达数万亿美元。因此，保护生物多样性不仅是环境问题，也是经济和社会的迫切需要。

全球范围内正在进行保护努力，包括建立保护区、恢复退化栖息地和濒危物种的人工繁殖计划。然而，科学家认为，如果不解决根本原因——迅速减少温室气体排放，这些措施本身是不够的。`,
  "B2", "academic", now()
);

insertQuestions(a1, [
  { type: "multiple_choice", questionText: "According to the passage, how far have marine species in the North Atlantic moved per decade?", options: ["A. 4 meters", "B. 30 kilometers", "C. 25 percent", "D. 50 kilometers"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What is 'phenology' as described in the passage?", options: ["A. The study of coral reefs", "B. The timing of biological events", "C. The migration of birds", "D. The process of coral bleaching"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What percentage of marine life is supported by coral reefs?", options: ["A. About 10 percent", "B. About 25 percent", "C. About 50 percent", "D. About 75 percent"], correctAnswer: "B" },
  { type: "true_false", questionText: "Coral bleaching occurs when corals absorb too many algae.", options: ["True", "False"], correctAnswer: "False" },
  { type: "true_false", questionText: "Scientists believe that reducing greenhouse gas emissions is necessary to protect biodiversity.", options: ["True", "False"], correctAnswer: "True" },
]);

// Article 2: Education
const a2 = cuid();
db.prepare(`INSERT INTO Article (id, title, titleCn, content, translation, difficulty, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
  a2, "The Digital Revolution in Education: Opportunities and Challenges", "教育领域的数字革命：机遇与挑战",
  `The integration of digital technology into education has transformed the way students learn and teachers teach. Over the past two decades, classrooms around the world have evolved from traditional chalk-and-board settings to interactive digital environments. This shift has brought both remarkable opportunities and significant challenges.

One of the most notable benefits of educational technology is increased access to learning resources. Students in remote areas can now access the same high-quality educational content as those in major cities through online platforms. Massive Open Online Courses, commonly known as MOOCs, have enabled millions of learners worldwide to study subjects ranging from computer science to philosophy, often free of charge.

Personalized learning represents another major advantage. Adaptive learning software can analyze a student's performance in real time and adjust the difficulty and style of content to match their individual needs. This approach helps struggling students catch up while allowing advanced learners to progress at their own pace. Research has shown that personalized learning can significantly improve academic outcomes, particularly in mathematics and language learning.

However, the digital transformation of education is not without its problems. The digital divide remains a serious concern, as students from low-income families often lack access to reliable internet connections and suitable devices. During the COVID-19 pandemic, this inequality became starkly visible when schools worldwide shifted to remote learning. Millions of students were unable to participate in online classes, widening the achievement gap between rich and poor.

Another challenge is the effect of screen time on student well-being. Extended exposure to digital devices has been linked to eye strain, reduced attention spans, and decreased physical activity among young learners. Some studies have also raised concerns about the impact of social media on mental health, particularly among teenagers.

Teachers also face difficulties in adapting to new technologies. Many educators report feeling inadequately trained to use digital tools effectively in their teaching. Professional development programs have struggled to keep pace with the rapid evolution of technology, leaving many teachers feeling overwhelmed and underprepared.

Despite these challenges, most experts agree that digital technology will continue to play an increasingly important role in education. The key lies in finding the right balance – leveraging technology to enhance learning while ensuring that no student is left behind and that the human element of teaching is not lost.`,
  `数字技术融入教育已经改变了学生学习和教师教学的方式。在过去二十年里，世界各地的教室已经从传统的粉笔和黑板环境演变为互动式数字环境。这一转变带来了显著的机遇，也带来了重大挑战。

教育技术最显著的好处之一是增加了学习资源的获取途径。偏远地区的学生现在可以通过在线平台访问与大城市学生相同的高质量教育内容。大规模开放在线课程（通常称为MOOC）已使全球数百万学习者能够学习从计算机科学到哲学的各种科目，而且通常是免费的。

个性化学习是另一个主要优势。自适应学习软件可以实时分析学生的表现，并调整内容的难度和风格以匹配他们的个人需求。这种方法帮助学习困难的学生迎头赶上，同时让高级学习者按自己的节奏进步。研究表明，个性化学习可以显著提高学业成绩，特别是在数学和语言学习方面。

然而，教育的数字化转型并非没有问题。数字鸿沟仍然是一个严重的问题，因为低收入家庭的学生往往缺乏可靠的互联网连接和合适的设备。在COVID-19大流行期间，当全球学校转向远程学习时，这种不平等变得明显可见。数百万学生无法参与在线课程，扩大了贫富之间的成绩差距。

另一个挑战是屏幕时间对学生健康的影响。长时间接触数字设备与青少年学习者的眼睛疲劳、注意力持续时间缩短和体力活动减少有关。一些研究还提出了社交媒体对心理健康影响的担忧，特别是对青少年的影响。

教师在适应新技术方面也面临困难。许多教育工作者报告说，他们对有效使用数字工具进行教学感到培训不足。专业发展项目难以跟上技术的快速演变，让许多教师感到不知所措和准备不足。

尽管存在这些挑战，大多数专家认为数字技术将继续在教育中发挥越来越重要的作用。关键在于找到正确的平衡——利用技术促进学习，同时确保没有学生掉队，并且不失去教学中的人文因素。`,
  "B1", "academic", now()
);

insertQuestions(a2, [
  { type: "multiple_choice", questionText: "What does MOOC stand for?", options: ["A. Modern Online Open Classroom", "B. Massive Open Online Courses", "C. Multiple Open Online Classes", "D. Major Open Online Curriculum"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "According to the passage, what is one benefit of adaptive learning software?", options: ["A. It replaces the need for teachers", "B. It provides free internet access", "C. It adjusts content to match individual student needs", "D. It reduces screen time for students"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "What happened during the COVID-19 pandemic according to the passage?", options: ["A. All students received free devices", "B. The digital divide became more visible", "C. Teachers received better training", "D. Screen time decreased significantly"], correctAnswer: "B" },
  { type: "true_false", questionText: "Personalized learning has been shown to improve outcomes particularly in history and art.", options: ["True", "False"], correctAnswer: "False" },
  { type: "true_false", questionText: "Most experts believe digital technology will become less important in education in the future.", options: ["True", "False"], correctAnswer: "False" },
]);

// Article 3: Urban Development
const a3 = cuid();
db.prepare(`INSERT INTO Article (id, title, titleCn, content, translation, difficulty, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
  a3, "Sustainable Cities: Rethinking Urban Development", "可持续城市：重新思考城市发展",
  `By 2050, the United Nations estimates that nearly 70 percent of the world's population will live in urban areas. This unprecedented urbanization presents both a challenge and an opportunity for creating sustainable, livable cities for future generations.

Traditional urban development models have often prioritized economic growth and automobile transportation at the expense of environmental quality and social equity. The result has been sprawling cities with high levels of air pollution, traffic congestion, and social segregation. In many major cities, the poorest residents are forced to live in areas with the worst environmental conditions, far from employment opportunities and essential services.

The concept of the "15-minute city" has gained attention as an alternative urban planning model. First proposed by French-Colombian scientist Carlos Moreno, the idea is simple but revolutionary: all residents should be able to meet their daily needs — work, shopping, education, healthcare, and leisure — within a 15-minute walk or bike ride from their homes. This approach reduces dependence on cars, lowers carbon emissions, and strengthens local communities.

Several cities have already begun implementing elements of this vision. Paris has invested heavily in cycling infrastructure, creating hundreds of kilometers of protected bike lanes and pedestrianizing major streets. Melbourne's "20-minute neighborhood" pilot program has demonstrated that mixed-use development can successfully combine residential, commercial, and recreational spaces within compact areas.

Green infrastructure is another key component of sustainable urban development. Urban parks, green roofs, and tree-lined streets provide multiple benefits: they absorb carbon dioxide, reduce urban heat island effects, manage stormwater runoff, and improve mental health. Singapore, often called a "city in a garden," has integrated greenery into its urban fabric through policies requiring new buildings to include green spaces equivalent to the land area they occupy.

However, creating sustainable cities is not without obstacles. The cost of retrofitting existing infrastructure can be substantial, and political opposition from entrenched interests — such as automobile and fossil fuel industries — is common. Additionally, without careful planning, green initiatives can lead to "green gentrification," where environmental improvements increase property values and displace lower-income residents.

Despite these challenges, the transition to sustainable urban development is not merely desirable but essential. Cities account for approximately 70 percent of global carbon emissions, making them crucial battlegrounds in the fight against climate change. The decisions made by urban planners and policymakers today will shape the quality of life for billions of people in the decades to come.`,
  `联合国估计，到2050年，全球将近70%的人口将居住在城市地区。这种前所未有的城市化为子孙后代创建可持续、宜居城市既带来了挑战，也带来了机遇。

传统的城市发展模式往往优先考虑经济增长和汽车交通，而牺牲环境质量和社会公平。其结果是城市无序扩张，空气污染严重，交通拥堵和社会隔离加剧。在许多大城市，最贫困的居民被迫居住在环境条件最差的地区，远离就业机会和基本服务。

"15分钟城市"的概念作为一种替代性城市规划模式已引起关注。这一概念由法裔哥伦比亚科学家卡洛斯·莫雷诺首次提出，其想法简单但具有革命性：所有居民都应能在离家15分钟步行或骑车距离内满足日常需求——工作、购物、教育、医疗和休闲。这种方法减少了对汽车的依赖，降低了碳排放，并加强了当地社区。

几个城市已经开始实施这一愿景的要素。巴黎大力投资自行车基础设施，建设了数百公里的受保护自行车道，并将主要街道步行化。墨尔本的"20分钟社区"试点项目证明，混合用途开发可以成功地将住宅、商业和休闲空间结合在紧凑的区域内。

绿色基础设施是可持续城市发展的另一个关键组成部分。城市公园、绿色屋顶和林荫街道提供了多重好处：它们吸收二氧化碳，减少城市热岛效应，管理暴雨径流，并改善心理健康。新加坡常被称为"花园城市"，它通过要求新建筑包含相当于其占地面积大小的绿色空间的政策，将绿色植物融入了城市肌理。

然而，创建可持续城市并非没有障碍。改造现有基础设施的成本可能很高，来自既得利益集团（如汽车和化石燃料行业）的政治反对也很常见。此外，如果没有仔细规划，绿色倡议可能导致"绿色绅士化"，即环境改善推高房价，导致低收入居民迁离。

尽管存在这些挑战，向可持续城市发展的过渡不仅令人向往，而且至关重要。城市约占全球碳排放的70%，使它们成为应对气候变化的关键战场。城市规划者和政策制定者今天做出的决定将塑造未来几十年数十亿人的生活质量。`,
  "B2", "academic", now()
);

insertQuestions(a3, [
  { type: "multiple_choice", questionText: "What percentage of the world's population is expected to live in cities by 2050?", options: ["A. About 50 percent", "B. About 60 percent", "C. About 70 percent", "D. About 80 percent"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "Who proposed the '15-minute city' concept?", options: ["A. The United Nations", "B. Carlos Moreno", "C. The mayor of Paris", "D. Melbourne city planners"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What is 'green gentrification' according to the passage?", options: ["A. Building more parks in wealthy areas", "B. Environmental improvements that displace lower-income residents", "C. The process of planting trees in cities", "D. Reducing carbon emissions through green technology"], correctAnswer: "B" },
  { type: "true_false", questionText: "Singapore requires new buildings to include green spaces equal to their land area.", options: ["True", "False"], correctAnswer: "True" },
  { type: "true_false", questionText: "Cities produce approximately 50 percent of global carbon emissions.", options: ["True", "False"], correctAnswer: "False" },
]);

// Article 4: Linguistics
const a4 = cuid();
db.prepare(`INSERT INTO Article (id, title, titleCn, content, translation, difficulty, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
  a4, "How Language Shapes the Way We Think", "语言如何塑造我们的思维方式",
  `The relationship between language and thought has fascinated philosophers and scientists for centuries. Does the language we speak influence how we perceive and understand the world, or is language merely a tool for expressing thoughts that exist independently of it? This question lies at the heart of a long-standing debate in cognitive science.

The strong version of linguistic determinism, often associated with the Sapir-Whorf hypothesis, suggests that the structure of a language determines how its speakers think. In its most extreme form, this theory claims that if a language lacks a word for a particular concept, its speakers are incapable of understanding that concept. Most modern linguists reject this extreme position, but a growing body of research supports a more nuanced view: language influences thought in subtle but measurable ways.

One compelling area of research involves spatial orientation. Speakers of languages like Guugu Yimithirr, an Aboriginal Australian language, do not use egocentric directions such as "left" and "right." Instead, they use cardinal directions — north, south, east, and west — for all spatial descriptions, even for objects immediately around them. As a result, speakers of such languages maintain an exceptional sense of geographical orientation, constantly tracking their position relative to cardinal directions in a way that speakers of English or Chinese rarely do.

Color perception provides another illuminating example. Different languages divide the color spectrum differently. Russian has two distinct words for blue — "goluboy" for light blue and "siniy" for dark blue — while English uses a single basic term. Studies have shown that Russian speakers are faster at distinguishing between shades of blue that cross the boundary between these two categories, suggesting that linguistic categories can influence perceptual processing.

The grammatical gender of nouns offers yet another window into language-thought interactions. In Spanish, the word for "bridge" is masculine, and Spanish speakers tend to describe bridges using masculine-associated adjectives such as "strong" and "long." In German, "bridge" is feminine, and German speakers more often use adjectives like "beautiful" and "elegant." These differences emerge even when speakers are using a different language to describe the objects, indicating that linguistic categories become deeply embedded in conceptual representations.

Perhaps most significantly for education, research suggests that the language in which we learn concepts can affect our ability to recall and apply them. Bilingual individuals often find it easier to access knowledge when using the same language in which they originally learned it. This has important implications for educational policy in multilingual societies.

While the debate continues, one thing is clear: language is far more than a neutral vehicle for expressing thought. It is an active participant in shaping the cognitive landscape of its speakers, influencing everything from spatial awareness to color discrimination to social attitudes.`,
  `语言与思维之间的关系几个世纪以来一直吸引着哲学家和科学家。我们说的语言是否影响我们感知和理解世界的方式？还是语言仅仅是一种表达思想的工具，而这些思想是独立于语言而存在的？这个问题是认知科学中长期争论的核心。

语言决定论的强版本通常与萨丕尔-沃尔夫假说相关联，它认为语言的结构决定了说话者如何思考。在其最极端的形式中，这一理论声称，如果一个语言缺少某个特定概念的词汇，其说话者就无法理解这个概念。大多数现代语言学家拒绝这种极端立场，但越来越多的研究支持一种更微妙的观点：语言以细微但可测量的方式影响思维。

一个引人注目的研究领域涉及空间定向。像古古伊米希尔语（一种澳大利亚原住民语言）这样的语言使用者不使用"左"和"右"这样的自我中心方向词。相反，他们使用基本方位——北、南、东、西——来描述所有空间，即使是包围在他们周围的物体。因此，这种语言的使用者保持了非凡的地理定向感，他们不断追踪自己相对于基本方位的位置，而这种方式是说英语或汉语的人很少会做的。

颜色感知提供了另一个有启发性的例子。不同的语言以不同的方式划分色谱。俄语有两个不同的词来表示蓝色——"goluboy"表示浅蓝色，"siniy"表示深蓝色——而英语使用单一的基本术语。研究表明，俄语使用者在区分跨越这两个类别边界的蓝色色调时更快，这表明语言类别可以影响感知处理。

名词的语法性别为语言-思维互动提供了另一个窗口。在西班牙语中，"桥"这个词是阳性的，西班牙语使用者倾向于使用阳性相关的形容词如"强壮"和"长"来描述桥梁。在德语中，"桥"是阴性的，德语使用者更常使用"美丽"和"优雅"等形容词。这些差异即使在使用不同语言描述物体时也会出现，表明语言类别深深地嵌入了概念表征中。

也许对教育来说最重要的是，研究表明我们学习概念所使用的语言会影响我们回忆和应用它们的能力。双语个体通常发现在使用最初学习时所使用的同一种语言时，更容易获得知识。这对多语言社会的教育政策有着重要影响。

虽然辩论仍在继续，但有一点是明确的：语言远不止是表达思想的中性工具。它是塑造说话者认知景观的积极参与者，影响着从空间意识到颜色区分再到社会态度的方方面面。`,
  "C1", "academic", now()
);

insertQuestions(a4, [
  { type: "multiple_choice", questionText: "What is the Sapir-Whorf hypothesis primarily concerned with?", options: ["A. The history of language families", "B. The relationship between language and thought", "C. The grammar of Aboriginal languages", "D. The development of bilingual education"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "How do speakers of Guugu Yimithirr describe spatial relationships?", options: ["A. Using left and right", "B. Using cardinal directions", "C. Using landmarks only", "D. Using gestures"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What do Russian speakers demonstrate about color perception?", options: ["A. They see fewer colors than English speakers", "B. They distinguish shades of blue faster than English speakers", "C. They cannot see the color blue", "D. They use the same word for all shades of blue"], correctAnswer: "B" },
  { type: "true_false", questionText: "Most modern linguists fully support the extreme version of linguistic determinism.", options: ["True", "False"], correctAnswer: "False" },
  { type: "true_false", questionText: "Bilingual people often retrieve knowledge more easily in the language they originally learned it in.", options: ["True", "False"], correctAnswer: "True" },
]);

// Article 5: Health and Nutrition
const a5 = cuid();
db.prepare(`INSERT INTO Article (id, title, titleCn, content, translation, difficulty, category, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
  a5, "The Mediterranean Diet: Science Behind a Centuries-Old Tradition", "地中海饮食：一项百年传统背后的科学",
  `For decades, researchers have been fascinated by the health and longevity of populations living around the Mediterranean Sea. People in countries such as Greece, Italy, and Spain have historically experienced lower rates of heart disease, certain cancers, and neurodegenerative conditions compared to those in Northern Europe and North America. Scientists now believe that the traditional Mediterranean diet is a major factor behind these health benefits.

The Mediterranean diet is characterized by a high consumption of fruits, vegetables, legumes, whole grains, nuts, and olive oil. Fish and seafood are eaten regularly but in moderate amounts, while poultry, eggs, and dairy products are consumed less frequently. Red meat and sweets are reserved for special occasions. Red wine is often enjoyed in moderation with meals, though this is optional and not recommended for everyone.

Olive oil, particularly extra virgin olive oil, is considered the cornerstone of the Mediterranean diet. It is rich in monounsaturated fatty acids and polyphenols, which are powerful antioxidants that reduce inflammation and protect cells from oxidative damage. Studies have shown that regular consumption of olive oil is associated with a reduced risk of stroke, heart attack, and premature death from cardiovascular disease.

The benefits of the Mediterranean diet extend beyond heart health. Research published in major medical journals has linked this dietary pattern to improved cognitive function in older adults and a lower risk of developing Alzheimer's disease. The diet's emphasis on plant-based foods, which are rich in fiber and beneficial phytochemicals, may also help prevent type 2 diabetes by improving insulin sensitivity and reducing chronic inflammation.

Interestingly, the Mediterranean diet is not just about specific foods but also about a broader lifestyle approach. Traditional Mediterranean eating patterns emphasize sharing meals with family and friends, eating slowly and mindfully, and engaging in regular physical activity. This social and behavioral dimension is now recognized as an integral part of the diet's health effects.

Despite its well-documented benefits, adherence to the Mediterranean diet has been declining in its countries of origin, particularly among younger generations. The globalization of food systems has introduced processed foods and fast-food chains into traditional Mediterranean communities, leading to rising obesity rates. Public health officials are now working to revitalize interest in traditional dietary patterns through education programs and food policies.

The growing body of scientific evidence supporting the Mediterranean diet has led many national dietary guidelines to recommend it as a model for healthy eating. However, nutritionists caution that the diet should be adapted to local food cultures rather than adopted rigidly. The underlying principles — abundant plant foods, healthy fats, moderate animal protein, and mindful eating — can be applied across diverse culinary traditions.`,
  `几十年来，研究人员一直对居住在地中海周围人群的健康和长寿感到着迷。希腊、意大利和西班牙等国家的人民历来比北欧和北美的人群患心脏病、某些癌症和神经退行性疾病的比率更低。科学家现在认为，传统的地中海饮食是这些健康益处背后的一个主要因素。

地中海饮食的特点是大量食用水果、蔬菜、豆类、全谷物、坚果和橄榄油。鱼和海鲜经常食用但量适中，而家禽、鸡蛋和奶制品则较少食用。红肉和甜食只在特殊场合食用。红酒通常在进餐时适量享用，尽管这并非必需，也不推荐给所有人。

橄榄油，特别是特级初榨橄榄油，被认为是地中海饮食的基石。它富含单不饱和脂肪酸和多酚，多酚是一种强效抗氧化剂，可以减少炎症，保护细胞免受氧化损伤。研究表明，经常食用橄榄油可降低中风、心脏病发作和心血管疾病引起的过早死亡风险。

地中海饮食的益处不仅限于心脏健康。发表在主要医学期刊上的研究已将这种饮食模式与改善老年人认知功能以及降低患阿尔茨海默病的风险联系起来。该饮食强调植物性食物，这些食物富含纤维和有益的植物化学物质，也可以通过提高胰岛素敏感性和减少慢性炎症来帮助预防2型糖尿病。

有趣的是，地中海饮食不仅关乎特定食物，还关乎更广泛的生活方式。传统的地中海饮食模式强调与家人和朋友分享餐食、慢慢地、专注地进食以及定期进行体育活动。这种社会和行为维度现在被认为是该饮食健康效应的一个组成部分。

尽管它的益处有据可查，但地中海饮食在其起源国的依从性一直在下降，特别是在年轻一代中。食品系统的全球化向传统地中海社区引入了加工食品和快餐连锁店，导致肥胖率上升。公共卫生官员正在努力通过教育项目和食品政策重振对传统饮食模式的兴趣。

越来越多的科学证据支持地中海饮食，这导致许多国家的膳食指南推荐将其作为健康饮食的模式。然而，营养学家警告说，饮食应适应当地的饮食文化，而不是僵化地采纳。其基本原则——丰富的植物性食物、健康的脂肪、适量的动物蛋白和专注的进食——可以应用于不同的烹饪传统。`,
  "B1", "general", now()
);

insertQuestions(a5, [
  { type: "multiple_choice", questionText: "What is considered the cornerstone of the Mediterranean diet?", options: ["A. Red meat", "B. Whole grains", "C. Olive oil", "D. Red wine"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "According to the passage, what does the Mediterranean diet help prevent besides heart disease?", options: ["A. Only cancer", "B. Type 2 diabetes and Alzheimer's disease", "C. Only obesity", "D. All infectious diseases"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "Why is adherence to the Mediterranean diet declining in its countries of origin?", options: ["A. The food is too expensive", "B. Globalization has introduced processed and fast foods", "C. People no longer like the taste", "D. The diet has been proven ineffective"], correctAnswer: "B" },
  { type: "true_false", questionText: "Red meat is a daily staple of the traditional Mediterranean diet.", options: ["True", "False"], correctAnswer: "False" },
  { type: "true_false", questionText: "Nutritionists recommend that the Mediterranean diet should be rigidly followed without adaptation to local cultures.", options: ["True", "False"], correctAnswer: "False" },
]);

function insertQuestions(
  articleId: string,
  questions: { type: string; questionText: string; options: string[]; correctAnswer: string }[]
) {
  const stmt = db.prepare(
    `INSERT INTO ArticleQuestion (id, articleId, type, questionText, options, correctAnswer, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  questions.forEach((q, i) => {
    stmt.run(cuid(), articleId, q.type, q.questionText, JSON.stringify(q.options), q.correctAnswer, i + 1);
  });
}

console.log("Seed completed: 5 articles with 25 questions");
db.close();
