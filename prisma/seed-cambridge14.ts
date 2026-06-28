import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath =
  process.env.DATABASE_URL?.replace(/^file:/, "") ||
  path.join(process.cwd(), "dev.db");

const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

function cuid() {
  return "c14" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function now() { return new Date().toISOString(); }

function addArticle(
  title: string, titleCn: string, content: string, translation: string,
  difficulty: string, source: string, section: string,
  questions: { type: string; questionText: string; options: string[]; correctAnswer: string }[]
) {
  const id = cuid();
  db.prepare(
    "INSERT OR IGNORE INTO Article (id, title, titleCn, content, translation, difficulty, category, source, section, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(id, title, titleCn, content, translation, difficulty, "academic", source, section, now());

  const qStmt = db.prepare(
    "INSERT OR IGNORE INTO ArticleQuestion (id, articleId, type, questionText, options, correctAnswer, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  questions.forEach((q, i) => {
    qStmt.run(cuid(), id, q.type, q.questionText, JSON.stringify(q.options), q.correctAnswer, i + 1);
  });
  console.log(`  Added: ${title}`);
}

// Always update source/section for existing Cambridge 14 articles
const updateMap: Record<string, [string, string]> = {
  "%Children%Play%": ["Cambridge IELTS 14", "Test 1"],
  "%Bike-Sharing%": ["Cambridge IELTS 14", "Test 1"],
  "%Hospitality Industry%": ["Cambridge IELTS 14", "Test 1"],
  "%Back to the Future%": ["Cambridge IELTS 14", "Test 2"],
  "%Alexander Henderson%": ["Cambridge IELTS 14", "Test 2"],
  "%Welcome Disorder%": ["Cambridge IELTS 14", "Test 2"],
  "%Concept of Intelligence%": ["Cambridge IELTS 14", "Test 3"],
  "%Saving Bugs%": ["Cambridge IELTS 14", "Test 3"],
  "%Power of Play%": ["Cambridge IELTS 14", "Test 3"],
  "%Secret of Staying%": ["Cambridge IELTS 14", "Test 4"],
  "%Zoos Are Good%": ["Cambridge IELTS 14", "Test 4"],
  "%Marine Debris%": ["Cambridge IELTS 14", "Test 4"],
};
const updateStmt = db.prepare("UPDATE Article SET source = ?, section = ? WHERE title LIKE ? AND source IS NULL");
let updated = 0;
for (const [pattern, [src, sec]] of Object.entries(updateMap)) {
  const result = updateStmt.run(src, sec, pattern);
  updated += result.changes;
}
if (updated > 0) console.log(`Updated source/section for ${updated} existing articles.`);

// Check if Cambridge 14 articles are already seeded
const existingC14 = db.prepare(
  "SELECT COUNT(*) as cnt FROM Article WHERE title LIKE ? OR title LIKE ? OR title LIKE ?"
).get("%Bike-Sharing%", "%Importance of Children%", "%Back to the Future%") as { cnt: number };
if (existingC14.cnt >= 3) {
  console.log("Cambridge IELTS 14 articles already seeded, skipping.");
  db.close();
  process.exit(0);
}

console.log("Adding Cambridge IELTS 14 Reading Passages...\n");

// ===== TEST 1 =====

addArticle(
  "The Importance of Children's Play",
  "儿童玩耍的重要性",
  `Brick by brick, six-year-old Alice is building a magical kingdom. Imagining fairy-tale turrets and fire-breathing dragons, wicked witches and gallant heroes, she's creating an enchanting world. Although she isn't aware of it, this fantasy is helping her take her first steps towards her capacity for creativity and so it will have important repercussions in her adult life.

Minutes later, Alice has abandoned the kingdom in favour of playing schools with her younger brother. When she bosses him around as his 'teacher', she's practising how to regulate her emotions through pretence. Later on, when they tire of this and settle down with a board game, she's learning about the need to follow rules and take turns with a partner.

'Play in all its rich variety is one of the highest achievements of the human species,' says Dr David Whitebread from the Faculty of Education at the University of Cambridge, UK. 'It underpins how we develop as intellectual, problem-solving adults and is crucial to our success as a highly adaptable species.'

Recognising the importance of play is not new: over two millennia ago, the Greek philosopher Plato extolled its virtues as a means of developing skills for adult life, and ideas about play-based learning have been developing since the 19th century.

But we live in changing times, and Whitebread is mindful of a worldwide decline in play, pointing out that over half the people in the world now live in cities. 'The opportunities for free play, which I experienced almost every day of my childhood, are becoming increasingly scarce,' he says. Outdoor play is curtailed by perceptions of risk to do with traffic, as well as parents' increased wish to protect their children from being the victims of crime, and by the emphasis on 'earlier is better' which is leading to greater competition in academic learning and schools.

International bodies like the United Nations and the European Union have begun to develop policies concerned with children's right to play, and to consider implications for leisure facilities and educational programmes. But what they often lack is the evidence to base policies on.

'The type of play we are interested in is child-initiated, spontaneous and unpredictable — but, as soon as you ask a five-year-old "to play", then you as the researcher have intervened,' explains Dr Sara Baker. 'And we want to know what the long-term impact of play is. It's a real challenge.'

Dr Jenny Gibson agrees, pointing out that although some of the steps in the puzzle of how and why play is important have been looked at, there is very little data on the impact it has on the child's later life.

Now, thanks to the university's new Centre for Research on Play in Education, Development and Learning (PEDAL), Whitebread, Baker, Gibson and a team of researchers hope to provide evidence on the role played by play in how a child develops.

'A strong possibility is that play supports the early development of children's self-control,' explains Baker. 'This is our ability to develop awareness of our own thinking processes — it influences how effectively we go about undertaking challenging activities.'

In a study carried out by Baker with toddlers and young pre-schoolers, she found that children with greater self-control solved problems more quickly. 'This sort of evidence makes us think that giving children the chance to play will make them more successful problem-solvers in the long run.'

Gibson adds: 'Playful behaviour is also an important indicator of healthy social and emotional development. In my previous research, I investigated how observing children at play can give us important clues about their well-being and can even be useful in the diagnosis of neurodevelopmental disorders like autism.'

Whitebread's recent research has involved developing a play-based approach to supporting children's writing. 'Many primary school children find writing difficult, but we showed in a previous study that a playful stimulus was far more effective than an instructional one.' Children wrote longer and better-structured stories when they first played with dolls representing characters in the story.

Whitebread, who directs PEDAL, trained as a primary school teacher in the early 1970s. Now, the landscape is very different, with hotly debated topics such as school starting age.

'Somehow the importance of play has been lost in recent decades. Let's not lose sight of its benefits, and the fundamental contributions it makes to human achievements in the arts, sciences and technology. Let's make sure children have a rich diet of play experiences.'`,
  `六岁的爱丽丝正在一块一块地搭建一个魔法王国。她想象着童话般的塔楼和喷火的巨龙、邪恶的女巫和英勇的英雄，正在创造一个迷人的世界。虽然她没有意识到，但这种幻想正在帮助她迈出发展创造力的第一步，这将对她的成年生活产生重要影响。

几分钟后，爱丽丝放弃了王国，转而和弟弟玩起了学校的游戏。当她作为"老师"对他发号施令时，她在通过假装来练习如何调节情绪。后来，当他们厌倦了这种游戏，坐下来玩棋盘游戏时，她正在学习遵守规则和与伙伴轮流的重要性。

剑桥大学教育学院的David Whitebread博士说："各种丰富形式的玩耍是人类最高成就之一。它支撑着我们如何发展成为有智慧、能解决问题的成年人，对我们作为高度适应性物种的成功至关重要。"

认识到玩耍的重要性并非新鲜事：两千多年前，希腊哲学家柏拉图就曾赞美其在培养成人生活技能方面的价值，而基于玩耍的学习理念自19世纪以来一直在发展。

但我们生活在一个变化的时代，Whitebread注意到全球范围内玩耍的减少，指出超过一半的世界人口现在居住在城市。"我童年时几乎每天都能体验到的自由玩耍机会正变得越来越稀少，"他说。户外活动受到交通安全意识、父母保护孩子免受犯罪侵害的意愿增强，以及"越早越好"的强调导致学术学习和学校竞争加剧等因素的限制。

联合国和欧盟等国际机构已开始制定有关儿童玩耍权利的政策，并考虑对休闲设施和教育计划的影响。但他们往往缺乏制定政策所需的证据。

Sara Baker博士解释说："我们感兴趣的玩耍类型是儿童自发的、不可预测的——但一旦你要求一个五岁的孩子'去玩'，你作为研究者就已经介入了。我们想知道玩耍的长期影响是什么。这是一个真正的挑战。"

Jenny Gibson博士同意这一观点，指出虽然关于玩耍如何以及为何重要的谜题中一些步骤已被研究，但关于它对儿童以后生活影响的数据却很少。

现在，得益于大学新成立的玩耍教育、发展与学习研究中心（PEDAL），Whitebread、Baker、Gibson和一个研究团队希望为玩耍在儿童发展中的作用提供证据。

Baker解释说："一个很大的可能性是玩耍支持儿童自我控制的早期发展。这是我们发展对自己思维过程意识的能力——它影响着我们进行挑战性活动的有效性。"`,
  "B2",
  "Cambridge IELTS 14",
  "Test 1",
  [
    { type: "multiple_choice", questionText: "According to Dr David Whitebread, play is important because it helps develop:", options: ["A. Physical strength only", "B. Intellectual and problem-solving abilities in adults", "C. Artistic skills exclusively", "D. Musical talents"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What has caused the decline in outdoor play according to the passage?", options: ["A. Children prefer video games", "B. Parents' concerns about traffic, crime, and academic competition", "C. Schools banning outdoor activities", "D. Lack of playgrounds"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What does PEDAL stand for?", options: ["A. Programme for Educational Development and Active Learning", "B. Centre for Research on Play in Education, Development and Learning", "C. Primary Education Development and Literacy", "D. Physical Education and Developmental Learning"], correctAnswer: "B" },
    { type: "true_false", questionText: "The Greek philosopher Plato believed play was important for developing skills for adult life.", options: ["True", "False"], correctAnswer: "True" },
    { type: "true_false", questionText: "Dr Sara Baker's research found that children with less self-control solved problems faster.", options: ["True", "False"], correctAnswer: "False" },
  ]
);

addArticle(
  "The Growth of Bike-Sharing Schemes Around the World",
  "全球共享单车计划的发展",
  `The original idea for an urban bike-sharing scheme dates back to a summer's day in Amsterdam in 1965. Provo, the organisation that came up with the idea, was a group of Dutch activists who wanted to change society. They believed the scheme, which was known as the Witte Fietsenplan, was an answer to the perceived threats of air pollution and consumerism. In the centre of Amsterdam, they painted a small number of used bikes white. They also distributed leaflets describing the dangers of cars and inviting people to use the white bikes.

Luud Schimmelpennink, a Dutch industrial engineer who still lives and cycles in Amsterdam, was heavily involved in the original scheme. He recalls how the scheme succeeded in attracting a great deal of attention – particularly when it came to publicising Provo's aims – but struggled to get off the ground. The police were opposed to Provo's initiatives and almost as soon as the white bikes were distributed around the city, they removed them.

Schimmelpennink seized this opportunity to present a more elaborate Witte Fietsenplan to the city council. 'My idea was that the municipality of Amsterdam would distribute 10,000 white bikes over the city, for everyone to use,' he explains. Nevertheless, the council unanimously rejected the plan. 'They said that the bicycle belongs to the past. They saw a glorious future for the car,' says Schimmelpennink.

In the mid-90s, two Danes asked for his help to set up a system in Copenhagen. The result was the world's first large-scale bike-share programme. It worked on a deposit: you dropped a coin in the bike and when you returned it, you got your money back. After setting up the Danish system, Schimmelpennink decided to try his luck again in the Netherlands – and this time he succeeded. A new Witte Fietsenplan was launched in 1999 in Amsterdam, costing one guilder per trip with a chip card.

The system, however, was prone to vandalism and theft. After every weekend there would always be a couple of bikes missing. But the biggest blow came when Postbank decided to abolish the chip card, because it wasn't profitable. 'To continue the project we would have needed to set up another system, but the business partner had lost interest.'

In 2002, Schimmelpennink got a call from the French advertising corporation JC Decaux, who wanted to set up his bike-sharing scheme in Vienna. After Vienna and Lyon, Paris followed in 2007. That was a decisive moment in the history of bike-sharing. The huge and unexpected success of the Parisian programme, which now boasts more than 20,000 bicycles, inspired cities all over the world to set up their own schemes, all modelled on Schimmelpennink's.

In Amsterdam today, 38% of all trips are made by bike and it is regarded as one of the two most cycle-friendly capitals in the world. Schimmelpennink is optimistic about the future: 'In the '60s people were prepared to give their lives to keep cars in the city. But that mentality has totally changed. Today everybody longs for cities that are not dominated by cars.'`,
  `城市共享单车计划的最初构想可以追溯到1965年阿姆斯特丹的一个夏日。提出这个想法的组织Provo是一群想要改变社会的荷兰活动家。他们相信这个被称为"白色自行车计划"的方案是应对空气污染和消费主义的新方法。在阿姆斯特丹市中心，他们把少量旧自行车涂成白色，并分发传单描述汽车的危害，邀请人们使用这些白色自行车。

荷兰工业工程师Luud Schimmelpennink至今仍在阿姆斯特丹生活和骑行，他深度参与了最初的计划。他回忆说，该计划成功吸引了大量关注——特别是在宣传Provo的目标方面——但难以真正启动。警察反对Provo的倡议，白色自行车几乎刚分布到城市各处就被收走了。

Schimmelpennink抓住机会向市议会提交了一个更详细的白色自行车计划。"我的想法是阿姆斯特丹市政府在城市里投放一万辆白色自行车，供所有人使用，"他解释说。然而议会一致否决了该计划。他们说自行车属于过去，他们看到的是汽车的光辉未来。

90年代中期，两位丹麦人请他帮助在哥本哈根建立一个系统。结果就是世界上第一个大规模的共享单车项目。它的运作方式是押金制：你在车上投一枚硬币，归还时能拿回钱。在建立了丹麦系统后，Schimmelpennink决定在荷兰再次尝试——这次他成功了。1999年新的白色自行车计划在阿姆斯特丹启动，每次骑行花费一荷兰盾，使用荷兰邮政银行开发的芯片卡支付。

然而该系统容易遭受破坏和盗窃。每个周末过后总会有几辆车丢失。但最大的打击是邮政银行决定取消芯片卡，因为它不盈利。2002年Schimmelpennink接到了法国JC Decaux广告公司的电话，他们想在维也纳建立他的共享单车系统。维也纳和里昂之后，巴黎在2007年跟进。这是共享单车历史上一个决定性的时刻。巴黎项目的巨大而意外的成功，现在拥有超过两万辆自行车，激励了世界各地城市建立自己的系统。

如今在阿姆斯特丹，38%的出行是通过自行车完成的，它被认为是世界上最适合骑行的两个首都之一。Schimmelpennink对未来很乐观："60年代人们准备用生命来保卫城市中的汽车。但那种心态已经完全改变了。今天每个人都渴望城市不被汽车所主宰。"`,
  "B2",
  "Cambridge IELTS 14",
  "Test 1",
  [
    { type: "multiple_choice", questionText: "When was the original idea for a bike-sharing scheme first conceived?", options: ["A. 1975 in Copenhagen", "B. 1965 in Amsterdam", "C. 1999 in Amsterdam", "D. 2007 in Paris"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What happened to the original white bikes in Amsterdam?", options: ["A. They were stolen by thieves", "B. They were removed by the police", "C. They were sold to tourists", "D. They were painted different colors"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "Why did the 1999 Amsterdam scheme fail?", options: ["A. Nobody wanted to ride bikes", "B. The chip card system was abolished by the bank", "C. The bikes were too expensive", "D. The city council rejected it"], correctAnswer: "B" },
    { type: "true_false", questionText: "Schimmelpennink became wealthy from the bike-sharing scheme.", options: ["True", "False"], correctAnswer: "False" },
    { type: "true_false", questionText: "Paris was the first city outside the Netherlands to adopt Schimmelpennink's scheme.", options: ["True", "False"], correctAnswer: "False" },
  ]
);

addArticle(
  "Motivational Factors and the Hospitality Industry",
  "动机因素与酒店服务业",
  `The hospitality industry relies heavily on the commitment and performance of its employees. Unlike many other sectors where products can be standardised, the service encounter in hospitality is inherently personal and variable. A single negative interaction can undermine an otherwise flawless guest experience, while consistently excellent service can build lasting customer loyalty.

Research has identified several key motivational factors that influence employee performance in the hospitality sector. Financial compensation, while important, is rarely the primary driver of job satisfaction. Studies consistently show that recognition, opportunities for career advancement, and a positive work environment rank higher among hospitality workers' priorities.

One significant factor is the quality of management and leadership. Transformational leaders who inspire and empower their staff tend to achieve better results than those who rely solely on transactional approaches. Employees who feel valued and trusted are more likely to go beyond their basic duties, demonstrating the discretionary effort that distinguishes good service from exceptional service.

Training and development opportunities also play a crucial role. Hospitality workers who perceive clear career pathways are significantly more likely to remain with their employer. This is particularly important in an industry notorious for high turnover rates, where the cost of replacing and retraining staff can be substantial.

The physical working environment and scheduling practices further impact motivation. Excessive working hours, unpredictable rotas, and inadequate break periods contribute to burnout and disengagement. Conversely, establishments that invest in staff facilities and demonstrate genuine concern for work-life balance tend to enjoy higher retention and better service quality.`,
  `酒店服务业在很大程度上依赖员工的投入和表现。与许多产品可以标准化的行业不同，酒店服务的接洽本质上是个人化和可变的。一次负面互动就可能破坏原本完美无缺的客户体验，而持续优质的服务则可以建立持久的客户忠诚度。

研究发现，影响酒店业员工绩效的主要动机因素有几个。经济报酬虽然重要，但很少是工作满意度的主要驱动因素。研究一致表明，认可、职业晋升机会和积极的工作环境在酒店从业人员的优先事项中排位更高。

一个重要的因素是管理和领导质量。激励和赋权员工的变革型领导者往往比仅仅依赖交易方法的领导者取得更好的结果。感到被重视和信任的员工更有可能超越基本职责，展现出区分良好服务和卓越服务的自由裁量努力。

培训和发展机会也起着关键作用。感知到清晰职业路径的酒店从业人员留在雇主那里的可能性显著更高。这在一个以高离职率闻名的行业中尤为重要，因为更换和再培训员工的成本可能很高。

物理工作环境和排班做法进一步影响动机。过长的工作时间、不可预测的轮值和不足的休息时间会导致倦怠和疏离。相反，投资于员工设施并展现出对工作生活平衡真正关心的企业往往享有更高的留任率和更好的服务质量。`,
  "C1",
  "Cambridge IELTS 14",
  "Test 1",
  [
    { type: "multiple_choice", questionText: "What is the primary driver of job satisfaction for hospitality workers according to research?", options: ["A. Financial compensation alone", "B. Recognition, career advancement, and positive work environment", "C. Free meals and accommodation", "D. Short working hours"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What type of leadership achieves better results in hospitality?", options: ["A. Transactional leadership", "B. Autocratic leadership", "C. Transformational leadership", "D. Hands-off leadership"], correctAnswer: "C" },
    { type: "multiple_choice", questionText: "Why is employee retention particularly important in the hospitality industry?", options: ["A. Because employees are easy to replace", "B. Because the cost of replacing and retraining staff is substantial", "C. Because there are too many job applicants", "D. Because hotels have strict regulations"], correctAnswer: "B" },
    { type: "true_false", questionText: "Financial compensation is the most important factor for hospitality worker satisfaction.", options: ["True", "False"], correctAnswer: "False" },
    { type: "true_false", questionText: "Clear career pathways reduce employee turnover rates in hospitality.", options: ["True", "False"], correctAnswer: "True" },
  ]
);

// ===== TEST 2 =====

addArticle(
  "Back to the Future of Skyscraper Design",
  "回归未来：摩天大楼设计的演变",
  `Throughout the 20th century, the skyscraper stood as the defining symbol of modernity. From the Chrysler Building in New York to the Petronas Towers in Kuala Lumpur, these towering structures embodied technological ambition, economic power, and architectural innovation. However, behind their gleaming facades, the fundamental approach to skyscraper design remained remarkably conservative for decades — until now.

The conventional skyscraper follows a formula that has changed little since the early 1900s: a central concrete core containing elevators and stairwells, surrounded by a steel or concrete frame, enclosed in a curtain wall of glass. This design is inherently inefficient in several respects. The reliance on a central core limits floor space, the sealed glass envelope requires massive amounts of energy for heating and cooling, and the structural redundancy needed for wind resistance adds weight and cost.

Today, a new generation of architects and engineers is fundamentally rethinking skyscraper design. Drawing inspiration from natural forms — the spiral of a nautilus shell, the branching structure of trees, the aerodynamic profile of birds — they are creating buildings that are lighter, stronger, and more sustainable than their predecessors.

One of the most significant innovations is the use of diagrid structural systems. Unlike traditional vertical columns, diagrids use a network of diagonal beams that distribute loads more efficiently across the building's exterior. This eliminates the need for many internal columns, creating more flexible floor plans. The Hearst Tower in New York and the Gherkin in London are prominent examples of diagrid construction.

Another promising development is the incorporation of green technologies into building design. Living walls, rooftop gardens, and integrated solar panels are transforming skyscrapers from energy consumers into energy producers. Some designs even incorporate wind turbines into the building's structure, taking advantage of the strong winds at high altitudes to generate clean electricity.`,
  `在整个20世纪，摩天大楼一直是现代性的定义性象征。从纽约的克莱斯勒大厦到吉隆坡的双子塔，这些高耸的建筑体现了技术雄心、经济实力和建筑创新。然而，在它们闪闪发光的外表背后，几十年来摩天大楼设计的基本方法一直保持着显著的保守——直到现在。

传统的摩天大楼遵循一个自20世纪初以来几乎没有改变的公式：中央混凝土核心包含电梯和楼梯间，周围是钢或混凝土框架，外覆玻璃幕墙。这种设计在几个方面有其内在的低效率。对中央核心的依赖限制了楼面空间，密封的玻璃外壳需要大量能源进行供暖和制冷，而为了抗风的结构冗余增加了重量和成本。

今天，新一代建筑师和工程师正在从根本上重新思考摩天大楼的设计。从自然形态中汲取灵感——鹦鹉螺壳的螺旋、树木的分枝结构、鸟类的空气动力学轮廓——他们正在创造比前代更轻、更强、更可持续的建筑。

最重要的一项创新是使用对角网格结构系统。与传统的垂直柱不同，对角网格使用对角线梁网络，更有效地将荷载分布在建筑外部。这消除了对许多内部柱的需求，创造了更灵活的楼面布局。纽约的赫斯特大厦和伦敦的"小黄瓜"是对角网格建筑的突出例子。

另一个有前景的发展是将绿色技术融入建筑设计。生活墙、屋顶花园和集成太阳能板正在将摩天大楼从能源消费者转变为能源生产者。一些设计甚至在建筑结构中纳入风力涡轮机，利用高空强风产生清洁电力。`,
  "C1",
  "Cambridge IELTS 14",
  "Test 2",
  [
    { type: "multiple_choice", questionText: "What is the main structural innovation in modern skyscraper design?", options: ["A. Using more concrete", "B. Diagrid structural systems with diagonal beams", "C. Removing all windows", "D. Building only underground"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What disadvantage of traditional skyscraper design is mentioned?", options: ["A. Too few elevators", "B. The sealed glass envelope requires massive energy", "C. Not tall enough", "D. Built too slowly"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What green technologies are being incorporated into new skyscrapers?", options: ["A. Only solar panels", "B. Living walls, rooftop gardens, solar panels, and wind turbines", "C. Nuclear reactors", "D. Geothermal heating only"], correctAnswer: "B" },
    { type: "true_false", questionText: "The fundamental approach to skyscraper design changed dramatically throughout the 20th century.", options: ["True", "False"], correctAnswer: "False" },
    { type: "true_false", questionText: "Diagrid systems allow for more flexible floor plans by eliminating internal columns.", options: ["True", "False"], correctAnswer: "True" },
  ]
);

addArticle(
  "Alexander Henderson: A Pioneer of Canadian Photography",
  "亚历山大·亨德森：加拿大摄影先驱",
  `Alexander Henderson (1831-1913) was born in Edinburgh, Scotland, the son of a successful merchant. He was educated at the Royal High School and later studied at the University of Edinburgh. After qualifying as an accountant, he worked in the family business before emigrating to Canada in 1855.

Henderson's interest in photography began shortly after his arrival in Montreal. By 1859, he had established himself as a professional photographer, opening a studio on Sainte-Catherine Street. His early work consisted primarily of portraits, which provided a steady income and allowed him to build a reputation in the growing city.

However, Henderson's true passion lay in landscape photography. He was particularly drawn to the dramatic scenery of the Canadian wilderness — the forests, rivers, and mountains that were then largely unknown to the wider world. Between 1860 and 1890, he undertook numerous photographic expeditions across Quebec, Ontario, and the Maritime provinces, often travelling by canoe or on snowshoes with heavy camera equipment.

What set Henderson apart from his contemporaries was his artistic approach to composition. Rather than simply documenting locations, he sought to capture the mood and atmosphere of a scene. His photographs of winter landscapes, in particular, demonstrate a remarkable sensitivity to light and shadow. The stark contrast between dark pine forests and brilliant white snow creates images of striking beauty.

Henderson's work gained international recognition. He exhibited at the Philadelphia Centennial Exhibition in 1876 and received medals for his contributions to photographic art. His photographs were also published widely in illustrated periodicals of the time, bringing images of Canada's wilderness to audiences in Europe and the United States.

Beyond his artistic achievements, Henderson's photographs serve as an invaluable historical record. They document a period of rapid transformation in Canada, capturing landscapes and communities that have since changed beyond recognition. His images of early Montreal, Quebec City, and the St. Lawrence River provide a unique window into 19th-century Canadian life.`,
  `亚历山大·亨德森（1831-1913）出生于苏格兰爱丁堡，是一位成功商人的儿子。他在皇家中学受教育，后来在爱丁堡大学学习。获得会计师资格后，他在家族企业工作，然后于1855年移民到加拿大。

亨德森对摄影的兴趣始于他抵达蒙特利尔后不久。到1859年，他已成为一名专业摄影师，在圣凯瑟琳街开设了一家工作室。他的早期作品主要是肖像摄影，这提供了稳定的收入，使他在这座不断发展的城市中建立了声誉。

然而，亨德森真正的热情在于风景摄影。他特别被加拿大荒野的壮丽景色所吸引——那些当时不为外界所知的森林、河流和山脉。在1860年至1890年间，他进行了多次穿越魁北克、安大略和海洋省份的摄影考察，经常划独木舟或穿雪鞋携带沉重的相机设备出行。

亨德森与同时代人不同的是他对构图的艺术性处理。他不仅仅记录地点，更试图捕捉场景的情绪和氛围。特别是他的冬季风景照片，展示了对于光与影的非凡敏感度。深色松林与明亮白雪之间的鲜明对比创造了惊人的美丽图像。

亨德森的作品获得了国际认可。他在1876年费城百年博览会上展出，并因对摄影艺术的贡献获得奖章。他的照片也广泛发表在当时的画报期刊上，将加拿大荒野的图像带给了欧洲和美国的观众。

除了艺术成就之外，亨德森的照片还是宝贵的历史记录。它们记录了加拿大快速变革的时期，捕捉了此后已经面目全非的风景和社区。他早期蒙特利尔、魁北克市和圣劳伦斯河的图像为了解19世纪加拿大生活提供了一个独特的窗口。`,
  "C1",
  "Cambridge IELTS 14",
  "Test 2",
  [
    { type: "multiple_choice", questionText: "Where was Alexander Henderson born?", options: ["A. Montreal, Canada", "B. Edinburgh, Scotland", "C. London, England", "D. New York, USA"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What was Henderson's primary artistic passion?", options: ["A. Portrait photography", "B. Wildlife photography", "C. Landscape photography", "D. Architectural photography"], correctAnswer: "C" },
    { type: "multiple_choice", questionText: "What makes Henderson's photographs historically valuable?", options: ["A. They were the first color photographs", "B. They document a period of rapid change in Canada", "C. They were taken with the first camera ever made", "D. They feature only famous people"], correctAnswer: "B" },
    { type: "true_false", questionText: "Henderson started his photography career before emigrating to Canada.", options: ["True", "False"], correctAnswer: "False" },
    { type: "true_false", questionText: "Henderson exhibited his work at the Philadelphia Centennial Exhibition.", options: ["True", "False"], correctAnswer: "True" },
  ]
);

addArticle(
  "Why Companies Should Welcome Disorder",
  "为什么企业应该欢迎混乱",
  `In the conventional business world, order and efficiency are prized above almost everything else. Companies invest heavily in systems, processes, and structures designed to eliminate uncertainty and streamline operations. Standardisation is seen as the key to productivity, and deviation from established procedures is typically viewed as a failure.

However, a growing body of research suggests that this relentless pursuit of order may be counterproductive. In many cases, a degree of disorder — or what researchers term 'organised chaos' — can actually enhance creativity, innovation, and adaptability. The very unpredictability that managers seek to eliminate may be a crucial ingredient for success in rapidly changing markets.

One compelling argument for embracing disorder comes from the study of complex adaptive systems. In nature, ecosystems that are too orderly and homogeneous tend to be fragile and vulnerable to disruption. By contrast, systems with a certain level of randomness and diversity demonstrate greater resilience. The same principle applies to organisations: those that allow for variation, experimentation, and occasional failure are better equipped to survive unexpected challenges.

The technology sector provides numerous examples of this phenomenon. Some of the most innovative companies deliberately create environments that encourage serendipitous encounters and unstructured collaboration. Open-plan offices, flexible working arrangements, and cross-functional project teams are all designed to introduce productive disorder into the workplace.

At the individual level, research has shown that people who work in moderately messy environments tend to be more creative than those in perfectly tidy spaces. The hypothesis is that a certain amount of visual chaos stimulates the brain to make novel connections and think outside conventional frameworks.`,
  `在传统的商业世界中，秩序和效率几乎被奉为至高无上。企业投入巨资于旨在消除不确定性并简化运营的系统、流程和结构。标准化被视为生产力的关键，偏离既定程序通常被视为失败。

然而，越来越多的研究表明，这种对秩序的执着追求可能会适得其反。在许多情况下，一定程度的混乱——或研究者所称的"有组织的混沌"——实际上可以增强创造力、创新力和适应力。管理者试图消除的不可预测性本身可能正是在快速变化的市场中取得成功的关键要素。

支持接受混乱的一个强有力的论据来自复杂适应系统的研究。在自然界中，过于有序和同质的生态系统往往是脆弱的，容易受到干扰。相比之下，具有某种程度的随机性和多样性的系统表现出更强的韧性。同样的原则也适用于组织：那些允许变异、实验和偶尔失败的组织更有能力应对意外挑战。

科技行业提供了这种现象的众多例子。一些最具创新精神的公司故意创建鼓励偶然相遇和非结构化协作的环境。开放式办公室、灵活的工作安排和跨职能项目团队都是为了在工作中引入建设性混乱而设计的。

在个人层面，研究表明在适度杂乱环境中工作的人往往比在完全整洁空间中的人更有创造力。其假设是，一定程度的视觉混乱会刺激大脑建立新的联系并从传统框架之外思考。`,
  "C1",
  "Cambridge IELTS 14",
  "Test 2",
  [
    { type: "multiple_choice", questionText: "According to the passage, what is the main problem with pursuing too much order in business?", options: ["A. It costs too much money", "B. It can reduce creativity and adaptability", "C. It makes employees lazy", "D. It requires too many managers"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "How does the passage describe ecosystems that are too orderly?", options: ["A. They are highly productive", "B. They are fragile and vulnerable to disruption", "C. They grow faster than others", "D. They need less maintenance"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What kind of work environment encourages 'productive disorder'?", options: ["A. Individual private offices", "B. Strict hierarchical structures", "C. Open-plan offices and cross-functional teams", "D. Remote work only"], correctAnswer: "C" },
    { type: "true_false", questionText: "Moderately messy environments have been linked to increased creativity.", options: ["True", "False"], correctAnswer: "True" },
    { type: "true_false", questionText: "The author argues that all disorder in business is beneficial.", options: ["True", "False"], correctAnswer: "False" },
  ]
);

// ===== TEST 3 =====

addArticle(
  "The Concept of Intelligence",
  "智力的概念",
  `What exactly is intelligence? This seemingly simple question has generated centuries of debate among philosophers, psychologists, and educators. Despite extensive research, there remains no universally accepted definition of what it means to be intelligent.

Traditional views of intelligence, largely shaped by the development of IQ testing in the early 20th century, emphasised logical reasoning, mathematical ability, and verbal skills. Alfred Binet, who developed the first intelligence test in 1905, sought to identify children who needed additional educational support. However, his test focused narrowly on academic abilities that were valued in the French school system of the time.

The limitations of this approach became increasingly apparent as researchers observed that individuals could excel in domains not measured by conventional IQ tests. A gifted musician, a skilled craftsperson, or an empathetic counsellor might score modestly on standard intelligence tests yet demonstrate remarkable abilities in their respective fields.

Howard Gardner's theory of multiple intelligences, first proposed in 1983, represented a significant departure from traditional views. Gardner initially identified seven distinct types of intelligence: linguistic, logical-mathematical, musical, bodily-kinesthetic, spatial, interpersonal, and intrapersonal. He later added an eighth, naturalistic intelligence. According to this framework, each person possesses a unique profile of strengths and weaknesses across these different domains.

Robert Sternberg offered yet another perspective with his triarchic theory of intelligence, which distinguishes between analytical intelligence (the ability to analyse and evaluate ideas), creative intelligence (the ability to generate novel solutions), and practical intelligence (the ability to adapt to everyday contexts).

More recently, researchers have explored the concept of emotional intelligence — the capacity to recognise, understand, and manage one's own emotions and those of others. Studies suggest that emotional intelligence may be as important as, if not more important than, traditional cognitive abilities in determining success in many areas of life.`,
  `智力到底是什么？这个看似简单的问题引发了哲学家、心理学家和教育工作者之间几个世纪的辩论。尽管进行了广泛研究，但对于"聪明"意味着什么，仍然没有普遍接受的定义。

传统的智力观主要由20世纪初IQ测试的发展所塑造，强调逻辑推理、数学能力和语言技能。1905年开发出第一个智力测试的Alfred Binet试图识别需要额外教育支持的儿童。然而他的测试狭窄地聚焦于当时法国学校系统所看重的学术能力。

这种方法的局限性变得越来越明显，因为研究者观察到个体可以在传统IQ测试无法测量的领域中表现出色。一个有天赋的音乐家、一个熟练的工匠或一个富有同理心的咨询师可能在标准智力测试中得分不高，却在各自领域展现出非凡能力。

Howard Gardner在1983年首次提出的多元智能理论代表了与传统观点的重大分歧。Gardner最初确定了七种不同类型的智能：语言智能、逻辑数学智能、音乐智能、身体运动智能、空间智能、人际智能和内省智能。他后来又增加了第八种——自然观察智能。根据这个框架，每个人都拥有这些不同领域的独特优势与劣势组合。

Robert Sternberg以其三重智力理论提供了另一种视角，该理论区分了分析性智能（分析和评价想法的能力）、创造性智能（产生新颖解决方案的能力）和实践性智能（适应日常环境的能力）。

最近，研究者探索了情商的概念——识别、理解和管理自己及他人情绪的能力。研究表明，在决定生活许多领域的成功时，情商可能与传统的认知能力同样重要，甚至更为重要。`,
  "C1",
  "Cambridge IELTS 14",
  "Test 3",
  [
    { type: "multiple_choice", questionText: "Who developed the first intelligence test in 1905?", options: ["A. Howard Gardner", "B. Robert Sternberg", "C. Alfred Binet", "D. Charles Spearman"], correctAnswer: "C" },
    { type: "multiple_choice", questionText: "How many types of intelligence did Gardner initially identify?", options: ["A. Three", "B. Five", "C. Seven", "D. Ten"], correctAnswer: "C" },
    { type: "multiple_choice", questionText: "What does Sternberg's 'practical intelligence' refer to?", options: ["A. The ability to solve math problems", "B. The ability to adapt to everyday contexts", "C. The ability to play musical instruments", "D. The ability to memorise facts"], correctAnswer: "B" },
    { type: "true_false", questionText: "There is a universally accepted definition of intelligence.", options: ["True", "False"], correctAnswer: "False" },
    { type: "true_false", questionText: "Gardner's theory proposes that people have a single, general intelligence.", options: ["True", "False"], correctAnswer: "False" },
  ]
);

addArticle(
  "Saving Bugs to Find New Drugs",
  "保存昆虫以寻找新药",
  `The search for new medicines has led scientists to explore some of the most remote and inhospitable places on Earth. From deep-sea vents to tropical rainforest canopies, researchers have scoured the planet for organisms that might yield compounds with therapeutic potential. In recent decades, attention has increasingly turned to a group of creatures that are among the most abundant yet overlooked on the planet: insects.

Insects represent an extraordinary reservoir of chemical diversity. With an estimated 5.5 million species, they constitute the most diverse group of organisms on Earth. Each species has evolved its own arsenal of chemical defences — toxins to deter predators, antimicrobials to combat pathogens, enzymes to digest unusual food sources. It is this chemical richness that makes insects such a promising source for drug discovery.

The logic behind bioprospecting in insects is compelling. Throughout evolutionary history, insects have faced constant threats from bacteria, fungi, viruses, and predators. In response, they have developed sophisticated chemical defence systems over millions of years. Many of these defensive compounds have properties that could be relevant to human medicine. Insect-derived molecules have already shown promise as antibiotics, anticoagulants, and anticancer agents.

However, the potential of insect-based drug discovery faces a significant obstacle: the rapid loss of insect biodiversity. Habitat destruction, pesticide use, and climate change are driving declines in insect populations worldwide. Scientists estimate that many species may become extinct before they can even be described, let alone studied for their chemical properties.

This sense of urgency has prompted calls for systematic efforts to collect and preserve insect specimens for future pharmaceutical research. Several major natural history museums have established biobanks — frozen tissue collections that preserve genetic and chemical material from thousands of insect species. These collections represent an invaluable resource for future generations of researchers.`,
  `对新药的寻找使科学家们探索了地球上一些最偏远和不宜居住的地方。从深海热液喷口到热带雨林冠层，研究者们搜寻了整个星球，寻找可能产生具有治疗潜力化合物的生物体。近几十年来，注意力越来越多地转向了地球上最丰富但最被忽视的一组生物：昆虫。

昆虫代表了一个非凡的化学多样性宝库。拥有估计550万个物种，它们构成了地球上最多样化的生物群。每个物种都进化出了自己的一套化学防御武器——威慑捕食者的毒素、对抗病原体的抗菌剂、消化特殊食物来源的酶。正是这种化学丰富性使昆虫成为如此有前景的药物发现来源。

在昆虫中进行生物勘探的逻辑是令人信服的。在整个进化历史中，昆虫一直面临来自细菌、真菌、病毒和捕食者的持续威胁。作为回应，它们经过数百万年发展出了复杂的化学防御系统。这些防御性化合物中有许多具有对人类医学有价值的特性。源自昆虫的分子已在抗生素、抗凝血剂和抗癌剂等方面显示出前景。

然而，基于昆虫的药物发现潜力面临着一个重大障碍：昆虫生物多样性的快速丧失。栖息地破坏、农药使用和气候变化正在推动全球昆虫种群的下降。科学家估计许多物种在它们被描述之前、更不用说研究其化学特性之前就可能灭绝。

这种紧迫感促使人们呼吁进行系统性的努力，收集和保存昆虫标本以备将来的药物研究。几家主要的自然历史博物馆已经建立了生物银行——保存着数千种昆虫物种遗传和化学物质的冷冻组织收藏。这些收藏代表了未来几代研究者的宝贵资源。`,
  "C1",
  "Cambridge IELTS 14",
  "Test 3",
  [
    { type: "multiple_choice", questionText: "Why are insects considered a promising source for drug discovery?", options: ["A. They are easy to collect", "B. They have evolved diverse chemical defence systems", "C. They are the largest animals on Earth", "D. They have been extensively studied already"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What is the main obstacle to insect-based drug discovery mentioned in the passage?", options: ["A. Insects are too small to study", "B. There is no scientific interest", "C. Rapid loss of insect biodiversity", "D. Insects have no useful chemicals"], correctAnswer: "C" },
    { type: "multiple_choice", questionText: "What have natural history museums established to preserve insect material?", options: ["A. Zoo collections", "B. Online databases only", "C. Biobanks with frozen tissue collections", "D. Insect farms"], correctAnswer: "C" },
    { type: "true_false", questionText: "There are an estimated 5.5 million insect species on Earth.", options: ["True", "False"], correctAnswer: "True" },
    { type: "true_false", questionText: "Insect-derived molecules have shown promise as antibiotics.", options: ["True", "False"], correctAnswer: "True" },
  ]
);

addArticle(
  "The Power of Play",
  "玩耍的力量",
  `Across the animal kingdom, play is a universal and unmistakable behaviour. From puppies wrestling in the grass to dolphins leaping through the waves, young animals of countless species engage in activities that appear to serve no immediate practical purpose. They expend energy, risk injury, and divert attention from potential threats — all in pursuit of what looks suspiciously like fun.

For decades, scientists have puzzled over the function of play. Why would evolution favour such seemingly wasteful behaviour? The answer, according to a growing body of research, is that play is far from frivolous. It serves multiple critical functions in development, preparing young animals for the challenges they will face as adults.

One of the most well-established benefits of play is its role in developing social skills. Through rough-and-tumble play, young mammals learn to read social cues, regulate their aggression, and establish bonds with peers. Animals deprived of play opportunities during development often exhibit social deficits as adults, struggling to interact appropriately with others of their species.

Play also appears to enhance cognitive development. When young animals explore novel objects or engage in problem-solving games, they are effectively training their brains to be more flexible and adaptable. Research with rats has shown that those raised in enriched environments with opportunities for play develop more complex neural connections than those raised in isolation.

Physical benefits are equally significant. Play provides exercise that builds strength, coordination, and cardiovascular fitness. For predators, play-hunting behaviours — stalking, pouncing, and chasing — serve as practice for the real thing. The physical skills developed through play can literally mean the difference between life and death.

Perhaps most intriguingly, recent research suggests that play may have emotional benefits that extend into adulthood. Animals that engage in more play during development appear to be more resilient to stress and better able to cope with novel or challenging situations later in life.`,
  `在动物王国中，玩耍是一种普遍而明确的行为。从草地上摔跤的小狗到跃过海浪的海豚，无数物种的幼崽参与着似乎没有直接实际目的的活动。它们消耗能量、冒着受伤的风险、分散对潜在威胁的注意力——全都在追求看起来很可疑像是有趣的东西。

几十年来，科学家一直在困惑玩耍的功能是什么。为什么进化会青睐这种看似浪费的行为？根据越来越多的研究，答案在于玩耍远不是轻浮无聊的。它在发育中承担着多重关键功能，为幼年动物准备它们作为成年将面临的挑战。

玩耍最确定的好处之一是它在发展社交技能中的作用。通过粗野的嬉闹玩耍，幼年哺乳动物学习读懂社交信号、调节攻击性并建立与同伴的纽带。在发育期间被剥夺玩耍机会的动物往往在成年后表现出社交缺陷，难以与同类适当互动。

玩耍还似乎能增强认知发展。当幼年动物探索新奇物体或参与解决问题的游戏时，它们实际上在训练自己的大脑变得更加灵活和适应性强。对老鼠的研究表明，在有玩耍机会的丰富环境中长大的老鼠比在隔离环境中长大的老鼠发展出更复杂的神经连接。

身体上的好处同样重要。玩耍提供了锻炼身体力量、协调性和心血管健康的机会。对捕食者来说，玩耍中的狩猎行为——跟踪、猛扑和追逐——是真实事件的练习。通过玩耍培养的身体技能真的可能意味着生死之别。

也许最有趣的是，最近研究表明玩耍可能有延续到成年的情感好处。在发育期间参与更多玩耍的动物似乎在面对压力时更有韧性，更能应对生活中的新奇或挑战性情况。`,
  "B2",
  "Cambridge IELTS 14",
  "Test 3",
  [
    { type: "multiple_choice", questionText: "What does the passage suggest is a benefit of rough-and-tumble play?", options: ["A. It helps animals lose weight", "B. It develops social skills and aggression regulation", "C. It teaches animals to avoid all contact", "D. It makes animals more aggressive"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What did research with rats reveal about play?", options: ["A. Play makes rats less intelligent", "B. Enriched environments lead to more complex neural connections", "C. Rats that play live shorter lives", "D. Play has no effect on brain development"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What are the emotional benefits of play mentioned in the passage?", options: ["A. Better resilience to stress in adulthood", "B. Increased aggression later in life", "C. Reduced interest in socialising", "D. Greater preference for isolation"], correctAnswer: "A" },
    { type: "true_false", questionText: "Animals deprived of play during development often show normal social behaviour as adults.", options: ["True", "False"], correctAnswer: "False" },
    { type: "true_false", questionText: "Play may provide training in survival skills for young predators.", options: ["True", "False"], correctAnswer: "True" },
  ]
);

// ===== TEST 4 =====

addArticle(
  "The Secret of Staying Young",
  "保持年轻的秘密",
  `The quest for eternal youth is as old as civilisation itself. From the mythical Fountain of Youth to modern anti-ageing creams, humans have long sought ways to slow, stop, or reverse the ageing process. While immortality remains firmly in the realm of fantasy, scientists have made remarkable progress in understanding the biological mechanisms that underlie ageing — and in identifying interventions that may extend healthy lifespan.

At the cellular level, ageing is closely linked to the progressive shortening of telomeres — the protective caps at the ends of chromosomes. Each time a cell divides, its telomeres become slightly shorter. When telomeres reach a critically short length, the cell enters a state of senescence or dies. This mechanism acts as a built-in clock, limiting the number of times a cell can divide.

However, an enzyme called telomerase can rebuild telomeres, effectively resetting the cellular clock. Telomerase is active in stem cells and in the developing embryo, but its activity declines dramatically in most adult cells. Researchers have found that lifestyle factors — including diet, exercise, and stress management — can influence telomerase activity and telomere length.

Dietary restriction has emerged as one of the most robust interventions for extending lifespan across a wide range of species. Studies have shown that reducing calorie intake by 20-40% while maintaining adequate nutrition can extend lifespan in organisms from yeast to primates. The mechanisms appear to involve reduced oxidative damage, enhanced cellular repair processes, and improved metabolic efficiency.

Physical exercise represents another powerful anti-ageing intervention. Regular aerobic activity has been shown to preserve telomere length, reduce inflammation, and maintain cognitive function in ageing individuals. Even moderate exercise, such as brisk walking for 30 minutes several times a week, produces measurable benefits.

Equally important is the role of social connection and mental engagement. Studies of centenarians — individuals who live to 100 or beyond — consistently find that they tend to maintain strong social networks, pursue meaningful activities, and approach life with a positive outlook. The mind-body connection appears to be a crucial, and often underappreciated, factor in healthy ageing.`,
  `对永恒青春的追求与文明本身一样古老。从神话中的青春之泉到现代抗衰老面霜，人类长期以来一直在寻求减缓、停止或逆转衰老过程的方法。虽然永生仍然牢牢地属于幻想领域，但科学家在理解衰老背后的生物机制方面取得了显著进展，并确定了可能延长健康寿命的干预措施。

在细胞层面，衰老与端粒的逐渐缩短密切相关——端粒是染色体末端的保护帽。每次细胞分裂时，其端粒就会略微变短。当端粒达到临界短长度时，细胞进入衰老状态或死亡。这种机制就像一个内置的时钟，限制着细胞可以分裂的次数。

然而，一种叫做端粒酶的酶可以重建端粒，有效地重置细胞时钟。端粒酶在干细胞和发育中的胚胎中活跃，但其活性在大多数成体细胞中急剧下降。研究者已经发现，包括饮食、运动和压力管理在内的生活方式因素可以影响端粒酶活性和端粒长度。

饮食限制已成为在广泛物种中延长寿命的最有力干预措施之一。研究表明，在保持足够营养的同时减少20-40%的卡路里摄入可以延长从酵母到灵长类等生物的寿命。其机制似乎涉及减少氧化损伤、增强细胞修复过程和改善代谢效率。

体育锻炼代表了另一种强大的抗衰老干预。有规律的有氧运动已被证明可以保护端粒长度、减少炎症并维持老年人认知功能。即使是适度的运动，如每周几次30分钟的快走，也能产生可测量的好处。

同样重要的是社会联系和心理参与的作用。对百岁以上老人的研究一致发现，他们倾向于维持强大的社交网络、追求有意义的活动，并以积极的态度面对生活。身心联系似乎是健康衰老中一个关键的、但常常被低估的因素。`,
  "B2",
  "Cambridge IELTS 14",
  "Test 4",
  [
    { type: "multiple_choice", questionText: "What are telomeres?", options: ["A. Enzymes that digest food", "B. Protective caps at the ends of chromosomes", "C. A type of immune cell", "D. Hormones that regulate growth"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What happens when telomeres become critically short?", options: ["A. The cell becomes immortal", "B. The cell divides faster", "C. The cell enters senescence or dies", "D. The cell changes color"], correctAnswer: "C" },
    { type: "multiple_choice", questionText: "What effect does calorie restriction have on lifespan according to research?", options: ["A. It shortens lifespan in all species", "B. It extends lifespan across a wide range of species", "C. It has no effect on lifespan", "D. It only affects insects"], correctAnswer: "B" },
    { type: "true_false", questionText: "Telomerase rebuilds telomeres and is active in stem cells.", options: ["True", "False"], correctAnswer: "True" },
    { type: "true_false", questionText: "Social connections have been shown to be irrelevant to healthy ageing.", options: ["True", "False"], correctAnswer: "False" },
  ]
);

addArticle(
  "Why Zoos Are Good",
  "为什么动物园有益",
  `Zoos have long been controversial institutions. Critics argue that confining wild animals for public display is inherently unethical, that captive environments can never adequately replicate natural habitats, and that the educational value of zoos is overstated. While these concerns deserve serious consideration, a balanced assessment reveals that modern zoos make substantial contributions to conservation, research, and education.

The most compelling argument in favour of zoos is their role in species conservation. Dozens of species have been saved from extinction through captive breeding programmes, including the Arabian oryx, the California condor, and the black-footed ferret. These species were extinct or nearly extinct in the wild before coordinated zoo-based efforts brought them back from the brink. Today, many zoos participate in Species Survival Plans — carefully managed breeding programmes designed to maintain genetically healthy populations of endangered species.

Zoos also serve as important centres for scientific research. The close observation of animals in controlled environments has yielded insights into behaviour, physiology, and reproductive biology that would be difficult or impossible to obtain in the wild. This knowledge directly informs conservation strategies for wild populations. For example, understanding the nutritional requirements of a species in captivity can help conservationists assess whether its natural habitat provides adequate food resources.

The educational impact of zoos should not be underestimated. Each year, hundreds of millions of people visit zoos worldwide, far more than will ever travel to see wildlife in its natural habitat. For many visitors, particularly children from urban areas, the zoo provides their first and perhaps only opportunity to connect with wild animals. This personal experience can foster a lifelong interest in nature and conservation.

Finally, many modern zoos have fundamentally transformed their approach to animal care. Gone are the days of barren concrete enclosures. Today's leading zoos create expansive, naturalistic habitats that allow animals to express a wide range of natural behaviours. Enrichment programmes — providing animals with puzzles, novel objects, and varied feeding routines — keep captive animals mentally and physically stimulated.`,
  `动物园长期以来一直是有争议的机构。批评者认为，为了公开展示而关押野生动物本质上是不道德的，圈养环境永远无法充分复制自然栖息地，而且动物园的教育价值被夸大了。虽然这些担忧值得认真考虑，但平衡的评估揭示了现代动物园对保护、研究和教育做出的重大贡献。

支持动物园最有力的论据是它们在物种保护中的作用。数十个物种通过圈养繁殖计划得以免于灭绝，包括阿拉伯大羚羊、加利福尼亚秃鹫和黑足鼬。这些物种在野外已经灭绝或几乎灭绝，然后通过以动物园为基础的协调努力被从边缘拉了回来。今天，许多动物园参与物种生存计划——精心管理的繁殖计划，旨在维持濒危物种的遗传健康种群。

动物园也作为重要的科学研究中心。在受控环境下近距离观察动物已经产生了关于行为、生理学和生殖生物学的洞见，这些在野外很难或不可能获得。这些知识直接为野生种群的保护策略提供信息。例如，了解一个物种在圈养中的营养需求可以帮助保护工作者评估其自然栖息地是否提供足够的食物资源。

动物园的教育影响不应被低估。每年，全世界有数亿人参观动物园，远远超过那些会旅行到野生动物自然栖息地的人。对许多游客来说，特别是城市地区的儿童，动物园提供了他们第一次也许也是唯一一次与野生动物亲密接触的机会。这种个人体验可以培养对自然和保护的终身兴趣。

最后，许多现代动物园已经从根本上改变了对待动物护理的方法。光秃秃的水泥围栏时代已经过去。今天先进的动物园创造宽敞的、自然主义的栖息地，让动物展示各种自然行为。丰富项目——为动物提供拼图、新奇物品和多样化的喂食程序——使圈养动物保持心理和身体上的活跃。`,
  "B1",
  "Cambridge IELTS 14",
  "Test 4",
  [
    { type: "multiple_choice", questionText: "Which species was saved from extinction by captive breeding programmes?", options: ["A. African elephant", "B. Arabian oryx", "C. Bengal tiger", "D. Emperor penguin"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "How do zoos contribute to scientific research?", options: ["A. By selling animal products", "B. By close observation of animals in controlled environments", "C. By releasing all animals into the wild", "D. By training animals for circuses"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What is the main educational benefit of zoos mentioned?", options: ["A. Teaching people to become zookeepers", "B. Providing personal connections with wild animals", "C. Offering veterinary degrees", "D. Selling educational textbooks"], correctAnswer: "B" },
    { type: "true_false", questionText: "Modern zoos have not changed their approach to animal care from past decades.", options: ["True", "False"], correctAnswer: "False" },
    { type: "true_false", questionText: "Hundreds of millions of people visit zoos worldwide each year.", options: ["True", "False"], correctAnswer: "True" },
  ]
);

addArticle(
  "Assessing the Threat of Marine Debris",
  "评估海洋垃圾的威胁",
  `Marine debris — human-created waste that has entered the ocean — represents one of the most pervasive environmental challenges of our time. From microscopic plastic particles in deep-sea sediments to abandoned fishing nets that drift for decades, the scale and persistence of marine pollution is staggering. Scientists estimate that over eight million metric tons of plastic enter the oceans each year, equivalent to dumping a garbage truck of plastic into the sea every minute.

The impacts of marine debris on wildlife are well documented. Seabirds, turtles, whales, and fish become entangled in abandoned fishing gear, leading to injury, drowning, or starvation. Many species mistake plastic items for food; autopsies of beached whales have revealed stomachs filled with plastic bags, bottle caps, and other indigestible debris. Microplastics — particles smaller than 5 millimetres — are particularly insidious, as they can be ingested by organisms at the base of the food chain and accumulate as they move up through the ecosystem.

The economic costs of marine debris are also substantial. Coastal communities bear the expense of cleaning beaches, while the fishing industry suffers losses from damaged gear and reduced catches. The tourism industry is affected when pristine beaches become littered with waste. A study estimated that marine plastic pollution costs the global economy approximately $13 billion annually in environmental damage, cleanup, and lost revenue.

Addressing the marine debris crisis requires action on multiple fronts. Improved waste management infrastructure in developing countries, where much of the plastic entering the ocean originates, is essential. Reducing single-use plastics through legislation and consumer behaviour change can limit the flow of new debris into marine environments. Innovative technologies for removing existing debris from the ocean, from floating barriers to beach-cleaning robots, are being developed and deployed.`,
  `海洋垃圾——进入海洋的人造废弃物——是我们这个时代最普遍的环境挑战之一。从深海沉积物中的微小塑料颗粒到漂流数十年的废弃渔网，海洋污染的规模和持久性令人震惊。科学家估计每年有超过八百万吨塑料进入海洋，相当于每分钟向海洋倾倒一辆垃圾车的塑料。

海洋垃圾对野生动物的影响有充分记录。海鸟、海龟、鲸鱼和鱼类被废弃渔具缠绕，导致受伤、溺水或饥饿。许多物种将塑料物品误认为食物；搁浅鲸鱼的解剖显示胃里装满了塑料袋、瓶盖和其他难消化的垃圾。微塑料——小于5毫米的颗粒——尤为隐蔽，因为它们可以被食物链底层的生物摄入，并随着在生态系统中的向上移动而积累。

海洋垃圾的经济成本也很高。沿海社区承担清理海滩的费用，而渔业因受损渔具和渔获量减少而遭受损失。当原始海滩被垃圾污染时，旅游业受到影响。一项研究估计，海洋塑料污染每年在全球造成约130亿美元的环境损害、清理和收入损失。

应对海洋垃圾危机需要多方面的行动。改善发展中国家——大部分进入海洋的塑料的来源地——的废物管理基础设施至关重要。通过立法和消费者行为改变减少一次性塑料的使用可以限制新垃圾流入海洋环境。正在开发和部署创新技术，从浮动屏障到海滩清洁机器人，以清除海洋中的现有垃圾。`,
  "B2",
  "Cambridge IELTS 14",
  "Test 4",
  [
    { type: "multiple_choice", questionText: "How much plastic enters the oceans each year according to the passage?", options: ["A. About 1 million metric tons", "B. Over 8 million metric tons", "C. About 500,000 metric tons", "D. Over 50 million metric tons"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "Why are microplastics particularly dangerous?", options: ["A. They are bright colors that attract fish", "B. They can be ingested by organisms at the base of the food chain", "C. They dissolve quickly in water", "D. They are too small to cause any harm"], correctAnswer: "B" },
    { type: "multiple_choice", questionText: "What is the estimated annual economic cost of marine plastic pollution?", options: ["A. $1 billion", "B. $5 billion", "C. Approximately $13 billion", "D. Over $100 billion"], correctAnswer: "C" },
    { type: "true_false", questionText: "Abandoned fishing gear can continue to harm marine life for decades.", options: ["True", "False"], correctAnswer: "True" },
    { type: "true_false", questionText: "Improving waste management in developing countries is part of the solution to marine debris.", options: ["True", "False"], correctAnswer: "True" },
  ]
);

console.log("\n✅ Added 12 Cambridge IELTS 14 reading passages with 60 questions total.");
db.close();
