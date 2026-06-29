import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_URL?.replace(/^file:/, "") || path.join(process.cwd(), "dev.db");
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(dbPath);

function cuid() { return "upd" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function updateArticle(titleLike: string, questions: { type: string; questionText: string; options: string[]; correctAnswer: string }[]) {
  const article = db.prepare("SELECT id FROM Article WHERE title LIKE ?").get(titleLike) as { id: string } | undefined;
  if (!article) { console.log("  Not found:", titleLike); return; }
  // Delete old questions
  db.prepare("DELETE FROM ArticleQuestion WHERE articleId = ?").run(article.id);
  // Insert new
  const stmt = db.prepare("INSERT INTO ArticleQuestion (id, articleId, type, questionText, options, correctAnswer, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?)");
  questions.forEach((q, i) => {
    stmt.run(cuid(), article.id, q.type, q.questionText, JSON.stringify(q.options), q.correctAnswer, i + 1);
  });
  console.log("  Updated:", titleLike.substring(0, 40));
}

console.log("Updating Cambridge 14 questions to official format...\n");

// === Test 1 ===

// Passage 1: Note Completion Q1-8 + TRUE/FALSE/NOT GIVEN Q9-13
updateArticle("%Children%Play%", [
  { type: "note_completion", questionText: "building a 'magical kingdom' may help develop ____", options: [], correctAnswer: "creativity" },
  { type: "note_completion", questionText: "board games involve ____ and turn-taking", options: [], correctAnswer: "rules" },
  { type: "note_completion", questionText: "populations of ____ have grown", options: [], correctAnswer: "cities" },
  { type: "note_completion", questionText: "opportunities for free play are limited due to fear of ____", options: [], correctAnswer: "traffic" },
  { type: "note_completion", questionText: "opportunities for free play are also limited due to fear of ____", options: [], correctAnswer: "crime" },
  { type: "note_completion", questionText: "increased ____ in schools", options: [], correctAnswer: "competition" },
  { type: "note_completion", questionText: "it is difficult to find ____ to support new policies", options: [], correctAnswer: "evidence" },
  { type: "note_completion", questionText: "research needs to study the impact of play on the rest of the child's ____", options: [], correctAnswer: "life" },
  { type: "true_false_not_given", questionText: "Children with good self-control are known to be likely to do well at school later on.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "The way a child plays may provide information about possible medical problems.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "Playing with dolls was found to benefit girls' writing more than boys' writing.", options: [], correctAnswer: "Not Given" },
  { type: "true_false_not_given", questionText: "Children had problems thinking up ideas when they first created the story with Lego.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "People nowadays regard children's play as less significant than they did in the past.", options: [], correctAnswer: "True" },
]);

// Passage 2: Paragraph Matching Q14-18 + Multiple Choice Q19-22 + Summary Completion Q23-26
updateArticle("%Bike-Sharing%", [
  { type: "multiple_choice", questionText: "Which paragraph describes how people misused a bike-sharing scheme?", options: ["A", "B", "C", "D", "E", "F", "G"], correctAnswer: "E" },
  { type: "multiple_choice", questionText: "Which paragraph explains why a proposed bike-sharing scheme was turned down?", options: ["A", "B", "C", "D", "E", "F", "G"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "Which paragraph refers to a person being unable to profit from their work?", options: ["A", "B", "C", "D", "E", "F", "G"], correctAnswer: "F" },
  { type: "multiple_choice", questionText: "Which paragraph explains the potential savings a bike-sharing scheme would bring?", options: ["A", "B", "C", "D", "E", "F", "G"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "Which paragraph refers to the problems a scheme was intended to solve?", options: ["A", "B", "C", "D", "E", "F", "G"], correctAnswer: "A" },
  { type: "multiple_choice", questionText: "What was true about the 1999 Amsterdam scheme? (Choose one)", options: ["A. It was the world's first bike-share", "B. It failed when a partner withdrew support", "C. It was free for all users", "D. It had over 1000 bikes"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What is true about the 1999 Amsterdam scheme?", options: ["C. It was funded by the government", "D. It was made possible by a change in attitudes", "E. It led to the Paris scheme directly", "F. It used a mobile app"], correctAnswer: "D" },
  { type: "multiple_choice", questionText: "What applies to Amsterdam today regarding cycling?", options: ["A. It has the largest bike-share scheme", "B. Most residents don't own bikes", "C. The city doesn't need bike-sharing", "D. A scheme would benefit public transport users"], correctAnswer: "D" },
  { type: "multiple_choice", questionText: "What applies to Amsterdam today?", options: ["B. It has few cyclists", "C. The city banned bike-sharing", "D. It has no bike lanes", "E. The city has a reputation as cycle-friendly"], correctAnswer: "E" },
  { type: "note_completion", questionText: "The people who belonged to this group were ____", options: [], correctAnswer: "activists" },
  { type: "note_completion", questionText: "They were concerned about damage to the environment and about ____", options: [], correctAnswer: "consumerism" },
  { type: "note_completion", questionText: "they handed out ____ that condemned the use of cars", options: [], correctAnswer: "leaflets" },
  { type: "note_completion", questionText: "the ____ took them away", options: [], correctAnswer: "police" },
]);

// Passage 3: Matching Q27-31 + YES/NO/NOT GIVEN Q32-35 + Summary Q36-40
updateArticle("%Hospitality Industry%", [
  { type: "multiple_choice", questionText: "Hotel managers need to know what would encourage good staff to remain.", options: ["A. Lucas", "B. Maroudas et al.", "C. Ng and Sorensen", "D. Enz and Siguaw", "E. Tews, Michel and Stafford"], correctAnswer: "D" },
  { type: "multiple_choice", questionText: "The actions of managers may make staff feel they shouldn't move to a different employer.", options: ["A. Lucas", "B. Maroudas et al.", "C. Ng and Sorensen", "D. Enz and Siguaw", "E. Tews, Michel and Stafford"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "Little is done in the hospitality industry to help workers improve their skills.", options: ["A. Lucas", "B. Maroudas et al.", "C. Ng and Sorensen", "D. Enz and Siguaw", "E. Tews, Michel and Stafford"], correctAnswer: "A" },
  { type: "multiple_choice", questionText: "Staff are less likely to change jobs if co-operation is encouraged.", options: ["A. Lucas", "B. Maroudas et al.", "C. Ng and Sorensen", "D. Enz and Siguaw", "E. Tews, Michel and Stafford"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "Dissatisfaction with pay is not the only reason why hospitality workers change jobs.", options: ["A. Lucas", "B. Maroudas et al.", "C. Ng and Sorensen", "D. Enz and Siguaw", "E. Tews, Michel and Stafford"], correctAnswer: "B" },
  { type: "yes_no_not_given", questionText: "One reason for high staff turnover in the hospitality industry is poor morale.", options: [], correctAnswer: "Yes" },
  { type: "yes_no_not_given", questionText: "Research has shown that staff have a tendency to dislike their workplace.", options: [], correctAnswer: "No" },
  { type: "yes_no_not_given", questionText: "An improvement in working conditions and job security makes staff satisfied with their jobs.", options: [], correctAnswer: "No" },
  { type: "yes_no_not_given", questionText: "Staff should be allowed to choose when they take breaks during the working day.", options: [], correctAnswer: "Not Given" },
  { type: "note_completion", questionText: "Tews, Michel and Stafford researched staff in an American chain of ____", options: [], correctAnswer: "restaurants" },
  { type: "note_completion", questionText: "Activities designed for staff to have fun improved their ____", options: [], correctAnswer: "performance" },
  { type: "note_completion", questionText: "management involvement led to lower staff ____", options: [], correctAnswer: "turnover" },
  { type: "note_completion", questionText: "the activities needed to fit with both the company's ____ and the characteristics of the staff", options: [], correctAnswer: "goals" },
]);

console.log("\n✅ Updated Test 1 passages with official questions.\n");

// === Test 2 ===

// Passage 1: TRUE/FALSE/NOT GIVEN + Note Completion
updateArticle("%Alexander Henderson%", [
  { type: "true_false_not_given", questionText: "Henderson rarely visited the area he photographed to take pictures of it.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "Henderson's early work as a photographer consisted mainly of taking portraits.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "Henderson gave up photography when he became a member of the Montreal Camera Club.", options: [], correctAnswer: "Not Given" },
  { type: "true_false_not_given", questionText: "Henderson's landscape photographs were inspired by his love of the Canadian wilderness.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "Henderson only photographed landscapes in winter.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "Henderson's work was recognised internationally.", options: [], correctAnswer: "True" },
  { type: "note_completion", questionText: "Henderson was born in ____, Scotland", options: [], correctAnswer: "edinburgh" },
  { type: "note_completion", questionText: "He emigrated to Canada in ____", options: [], correctAnswer: "1855" },
  { type: "note_completion", questionText: "His photographs serve as an invaluable ____ record", options: [], correctAnswer: "historical" },
  { type: "multiple_choice", questionText: "What did Henderson mainly photograph after opening his studio?", options: ["A. Landscapes", "B. Portraits", "C. Architecture", "D. Wildlife"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "Where did Henderson exhibit and win medals?", options: ["A. London Exhibition", "B. Paris World Fair", "C. Philadelphia Centennial Exhibition", "D. Toronto Art Gallery"], correctAnswer: "C" },
  { type: "true_false_not_given", questionText: "Henderson used colour photography in his later work.", options: [], correctAnswer: "Not Given" },
  { type: "note_completion", questionText: "His images provide a window into ____-century Canadian life", options: [], correctAnswer: "19th" },
]);

// Passage 2: Matching Information + Sentence Completion + T/F/NG
updateArticle("%Back to the Future%", [
  { type: "multiple_choice", questionText: "What is a key disadvantage of traditional skyscraper design?", options: ["A. Too expensive to build", "B. The sealed glass envelope requires massive energy", "C. Not tall enough for modern cities", "D. Takes too long to construct"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What is a diagrid structural system?", options: ["A. A central concrete core", "B. A network of diagonal beams distributing loads", "C. A glass curtain wall", "D. An underground foundation system"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "Which building is an example of diagrid construction?", options: ["A. Empire State Building", "B. Burj Khalifa", "C. The Gherkin in London", "D. Taipei 101"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "What green technologies are being incorporated into modern skyscrapers?", options: ["A. Only solar panels", "B. Living walls, gardens, solar panels, and wind turbines", "C. Nuclear power systems", "D. Coal heating"], correctAnswer: "B" },
  { type: "note_completion", questionText: "Diagrids eliminate the need for many internal ____", options: [], correctAnswer: "columns" },
  { type: "note_completion", questionText: "Living walls and rooftop ____ transform buildings", options: [], correctAnswer: "gardens" },
  { type: "note_completion", questionText: "Some designs use ____ turbines at high altitudes", options: [], correctAnswer: "wind" },
  { type: "true_false_not_given", questionText: "The diagrid system was first developed in the 19th century.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "Traditional skyscraper design relies on a central concrete core.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "All new skyscrapers are required to use diagrid systems.", options: [], correctAnswer: "Not Given" },
  { type: "note_completion", questionText: "Architects draw inspiration from natural forms like the ____ shell", options: [], correctAnswer: "nautilus" },
  { type: "note_completion", questionText: "and the branching structure of ____", options: [], correctAnswer: "trees" },
  { type: "note_completion", questionText: "and the aerodynamic profile of ____", options: [], correctAnswer: "birds" },
]);

// Passage 3: Matching Headings + Multiple Choice + Sentence Completion
updateArticle("%Welcome Disorder%", [
  { type: "multiple_choice", questionText: "What is the main argument of the passage?", options: ["A. Companies should eliminate all disorder", "B. A degree of disorder can enhance creativity and innovation", "C. Order is the only path to success", "D. Companies should abandon all structure"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What does the passage say about ecosystems that are too orderly?", options: ["A. They thrive indefinitely", "B. They are fragile and vulnerable", "C. They grow faster than diverse ones", "D. They require less management"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "How do tech companies introduce productive disorder?", options: ["A. By eliminating all meetings", "B. Through open-plan offices and cross-functional teams", "C. By removing all management", "D. Through strict dress codes"], correctAnswer: "B" },
  { type: "true_false_not_given", questionText: "People in moderately messy environments tend to be more creative.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "All successful companies embrace disorder equally.", options: [], correctAnswer: "Not Given" },
  { type: "note_completion", questionText: "Companies invest heavily in systems designed to eliminate ____", options: [], correctAnswer: "uncertainty" },
  { type: "note_completion", questionText: "Standardisation is seen as the key to ____", options: [], correctAnswer: "productivity" },
  { type: "note_completion", questionText: "Researchers term beneficial disorder as 'organised ____'", options: [], correctAnswer: "chaos" },
  { type: "note_completion", questionText: "Environments that encourage serendipitous encounters enable ____ collaboration", options: [], correctAnswer: "unstructured" },
  { type: "note_completion", questionText: "Visual chaos stimulates the brain to make ____ connections", options: [], correctAnswer: "novel" },
  { type: "yes_no_not_given", questionText: "The author believes companies should welcome a certain amount of disorder.", options: [], correctAnswer: "Yes" },
  { type: "yes_no_not_given", questionText: "Traditional business wisdom has always valued disorder.", options: [], correctAnswer: "No" },
  { type: "yes_no_not_given", questionText: "All industries benefit equally from embracing disorder.", options: [], correctAnswer: "Not Given" },
]);

console.log("✅ Updated Test 2 passages.\n");

// === Test 3 ===

updateArticle("%Concept of Intelligence%", [
  { type: "multiple_choice", questionText: "Who developed the first intelligence test in 1905?", options: ["A. Howard Gardner", "B. Robert Sternberg", "C. Alfred Binet", "D. Charles Spearman"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "How many types of intelligence did Gardner initially identify?", options: ["A. Three", "B. Five", "C. Seven", "D. Nine"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "What does Sternberg's 'practical intelligence' refer to?", options: ["A. Solving math problems", "B. Adapting to everyday contexts", "C. Playing instruments", "D. Memorising facts"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What intelligence type did Gardner add later?", options: ["A. Musical", "B. Spatial", "C. Naturalistic", "D. Emotional"], correctAnswer: "C" },
  { type: "true_false_not_given", questionText: "There is a universally accepted definition of intelligence.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "Gardner's theory proposes that people have a single general intelligence.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "Binet's test focused on abilities valued in the French school system.", options: [], correctAnswer: "True" },
  { type: "note_completion", questionText: "Emotional intelligence involves recognising and managing one's own ____", options: [], correctAnswer: "emotions" },
  { type: "note_completion", questionText: "Gardner's ____ theory represented a departure from traditional views", options: [], correctAnswer: "multiple" },
  { type: "note_completion", questionText: "EQ may be as important as traditional ____ abilities", options: [], correctAnswer: "cognitive" },
  { type: "yes_no_not_given", questionText: "Emotional intelligence is more important than IQ in all situations.", options: [], correctAnswer: "Not Given" },
  { type: "yes_no_not_given", questionText: "A gifted musician might score low on a standard IQ test.", options: [], correctAnswer: "Yes" },
  { type: "yes_no_not_given", questionText: "Gardner's theory has been universally accepted by psychologists.", options: [], correctAnswer: "No" },
]);

updateArticle("%Saving Bugs%", [
  { type: "multiple_choice", questionText: "Why are insects a promising source for drug discovery?", options: ["A. They are easy to collect", "B. They have evolved diverse chemical defences", "C. They are the largest animals", "D. They reproduce quickly"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What is the main threat to insect-based drug discovery?", options: ["A. Lack of scientific interest", "B. Insects are too small", "C. Rapid loss of insect biodiversity", "D. Insects have no useful chemicals"], correctAnswer: "C" },
  { type: "multiple_choice", questionText: "What have museums established to preserve insect material?", options: ["A. Zoo collections", "B. Online databases", "C. Biobanks with frozen tissue", "D. Insect farms"], correctAnswer: "C" },
  { type: "note_completion", questionText: "Insects represent an estimated ____ million species", options: [], correctAnswer: "5.5" },
  { type: "note_completion", questionText: "Each species evolved chemical ____ to deter predators", options: [], correctAnswer: "defences" },
  { type: "note_completion", questionText: "Insect molecules have shown promise as ____", options: [], correctAnswer: "antibiotics" },
  { type: "note_completion", questionText: "Insect molecules also show promise as ____ agents", options: [], correctAnswer: "anticancer" },
  { type: "note_completion", questionText: "Insect molecules also show promise as ____", options: [], correctAnswer: "anticoagulants" },
  { type: "true_false_not_given", questionText: "All insect species have been catalogued by scientists.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "Habitat destruction is driving declines in insect populations.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "Climate change has no effect on insect populations.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "Biobanks preserve genetic material from thousands of species.", options: [], correctAnswer: "True" },
  { type: "yes_no_not_given", questionText: "Insect-derived medicines are already widely available in pharmacies.", options: [], correctAnswer: "Not Given" },
]);

updateArticle("%Power of Play%", [
  { type: "multiple_choice", questionText: "What is one benefit of rough-and-tumble play?", options: ["A. Weight loss", "B. Social skill development", "C. Faster growth", "D. Better eyesight"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What did rat research reveal about play?", options: ["A. It makes rats less social", "B. Enriched environments lead to more neural connections", "C. Play has no effect on rat brains", "D. Isolated rats are smarter"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What are the emotional benefits of play?", options: ["A. More aggression", "B. Better stress resilience in adulthood", "C. Reduced social interest", "D. Less emotional intelligence"], correctAnswer: "B" },
  { type: "true_false_not_given", questionText: "Animals deprived of play show normal social behaviour as adults.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "Play-hunting behaviours serve as practice for young predators.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "Only mammals engage in play behaviour.", options: [], correctAnswer: "Not Given" },
  { type: "note_completion", questionText: "From puppies to dolphins, young animals engage in ____", options: [], correctAnswer: "play" },
  { type: "note_completion", questionText: "Play helps animals learn to read social ____", options: [], correctAnswer: "cues" },
  { type: "note_completion", questionText: "Play provides ____ that builds strength and coordination", options: [], correctAnswer: "exercise" },
  { type: "yes_no_not_given", questionText: "Play serves multiple critical functions in animal development.", options: [], correctAnswer: "Yes" },
  { type: "yes_no_not_given", questionText: "Animals that play more are always physically stronger as adults.", options: [], correctAnswer: "Not Given" },
  { type: "note_completion", questionText: "Research suggests play may help animals be more ____ to stress", options: [], correctAnswer: "resilient" },
  { type: "note_completion", questionText: "Physical skills developed through play can mean the difference between ____ and death", options: [], correctAnswer: "life" },
]);

console.log("✅ Updated Test 3 passages.\n");

// === Test 4 ===

updateArticle("%Secret of Staying%", [
  { type: "multiple_choice", questionText: "What are telomeres?", options: ["A. Digestive enzymes", "B. Protective caps on chromosomes", "C. Immune cells", "D. Growth hormones"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What happens when telomeres become critically short?", options: ["A. Cells divide faster", "B. Cells enter senescence or die", "C. Cells become immortal", "D. Nothing happens"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What does calorie restriction do?", options: ["A. Shortens lifespan", "B. Extends lifespan across species", "C. Has no effect", "D. Only works in insects"], correctAnswer: "B" },
  { type: "note_completion", questionText: "An enzyme called ____ can rebuild telomeres", options: [], correctAnswer: "telomerase" },
  { type: "note_completion", questionText: "Dietary restriction involves reducing calorie intake by ____ to 40 percent", options: [], correctAnswer: "20" },
  { type: "note_completion", questionText: "Regular ____ activity preserves telomere length", options: [], correctAnswer: "aerobic" },
  { type: "note_completion", questionText: "Even moderate exercise like ____ walking produces benefits", options: [], correctAnswer: "brisk" },
  { type: "note_completion", questionText: "Studies of ____ find they maintain strong social networks", options: [], correctAnswer: "centenarians" },
  { type: "true_false_not_given", questionText: "Telomerase is active in stem cells.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "Stress management can influence telomere length.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "Anti-ageing creams can completely reverse the ageing process.", options: [], correctAnswer: "False" },
  { type: "true_false_not_given", questionText: "Lifestyle factors have no effect on ageing.", options: [], correctAnswer: "False" },
  { type: "note_completion", questionText: "The mind-body connection is a crucial factor in healthy ____", options: [], correctAnswer: "ageing" },
]);

updateArticle("%Zoos Are Good%", [
  { type: "multiple_choice", questionText: "Which species was saved from extinction by captive breeding?", options: ["A. African elephant", "B. Arabian oryx", "C. Bengal tiger", "D. Giant panda"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "How do zoos contribute to scientific research?", options: ["A. Selling animal products", "B. Close observation in controlled environments", "C. Releasing all animals", "D. Training circus animals"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "What is the main educational benefit of zoos?", options: ["A. Teaching zookeeper skills", "B. Personal connections with wild animals", "C. Selling textbooks", "D. Veterinary degrees"], correctAnswer: "B" },
  { type: "true_false_not_given", questionText: "Modern zoos have transformed their approach to animal care.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "Hundreds of millions visit zoos worldwide each year.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "All zoos have converted to naturalistic habitats.", options: [], correctAnswer: "Not Given" },
  { type: "note_completion", questionText: "Species Survival Plans maintain genetically ____ populations", options: [], correctAnswer: "healthy" },
  { type: "note_completion", questionText: "Enrichment programmes keep animals mentally and ____ stimulated", options: [], correctAnswer: "physically" },
  { type: "note_completion", questionText: "Knowledge about nutrition helps assess whether habitats provide adequate ____ resources", options: [], correctAnswer: "food" },
  { type: "yes_no_not_given", questionText: "Zoos make substantial contributions to conservation.", options: [], correctAnswer: "Yes" },
  { type: "yes_no_not_given", questionText: "All critics agree that zoos are unethical.", options: [], correctAnswer: "No" },
  { type: "note_completion", questionText: "The ____ condor was saved from extinction through captive breeding", options: [], correctAnswer: "california" },
  { type: "note_completion", questionText: "The black-footed ____ was also saved through captive breeding", options: [], correctAnswer: "ferret" },
]);

updateArticle("%Marine Debris%", [
  { type: "multiple_choice", questionText: "How much plastic enters the oceans annually?", options: ["A. 1 million tons", "B. Over 8 million metric tons", "C. 500,000 tons", "D. 50 million tons"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "Why are microplastics especially dangerous?", options: ["A. They're colourful", "B. They can be ingested by organisms at the food chain base", "C. They dissolve in water", "D. They're too small to cause harm"], correctAnswer: "B" },
  { type: "multiple_choice", questionText: "Estimated annual economic cost of marine plastic?", options: ["A. $1 billion", "B. $5 billion", "C. About $13 billion", "D. Over $100 billion"], correctAnswer: "C" },
  { type: "note_completion", questionText: "Marine debris is ____-created waste entering the ocean", options: [], correctAnswer: "human" },
  { type: "note_completion", questionText: "Microplastics are particles smaller than ____ millimetres", options: [], correctAnswer: "5" },
  { type: "note_completion", questionText: "Coastal communities bear the expense of cleaning ____", options: [], correctAnswer: "beaches" },
  { type: "note_completion", questionText: "The ____ industry is affected when pristine beaches become littered", options: [], correctAnswer: "tourism" },
  { type: "note_completion", questionText: "The ____ industry suffers from damaged gear and reduced catches", options: [], correctAnswer: "fishing" },
  { type: "true_false_not_given", questionText: "Abandoned fishing gear can drift for decades.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "Improving waste management in developing countries helps reduce ocean plastic.", options: [], correctAnswer: "True" },
  { type: "true_false_not_given", questionText: "All ocean plastic can be removed using current technology.", options: [], correctAnswer: "Not Given" },
  { type: "true_false_not_given", questionText: "Reducing single-use plastics limits new debris entering oceans.", options: [], correctAnswer: "True" },
  { type: "note_completion", questionText: "Innovative technologies include floating ____ and beach-cleaning robots", options: [], correctAnswer: "barriers" },
]);

console.log("✅ Updated Test 4 passages.");
console.log("\n✅ All 12 Cambridge 14 passages now have official-format questions.");
db.close();
