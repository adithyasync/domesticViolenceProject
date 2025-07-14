const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Path to the SQLite database file
const dbPath = path.join(__dirname, "domestic_violence_support.db");

let db = null;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, JS) from a 'public' directory
app.use(express.static("public"));

// Set the view engine to render HTML templates
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create the cases table and additional tables for different age groups
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS cases (
        id INTEGER PRIMARY KEY,
        problem TEXT NOT NULL,
        solution TEXT NOT NULL,
        severity_level TEXT,
        date DATE DEFAULT CURRENT_DATE
      );
    `;
    await db.run(createTableQuery);

    // Creating tables for different age groups
    const createYouthTableQuery = `
      CREATE TABLE IF NOT EXISTS youth_cases (
        id INTEGER PRIMARY KEY,
        problem TEXT NOT NULL,
        solution TEXT NOT NULL,
        severity_level TEXT,
        date DATE DEFAULT CURRENT_DATE
      );
    `;
    const createAdultTableQuery = `
      CREATE TABLE IF NOT EXISTS adult_cases (
        id INTEGER PRIMARY KEY,
        problem TEXT NOT NULL,
        solution TEXT NOT NULL,
        severity_level TEXT,
        date DATE DEFAULT CURRENT_DATE
      );
    `;
    const createSeniorTableQuery = `
      CREATE TABLE IF NOT EXISTS senior_cases (
        id INTEGER PRIMARY KEY,
        problem TEXT NOT NULL,
        solution TEXT NOT NULL,
        severity_level TEXT,
        date DATE DEFAULT CURRENT_DATE
      );
    `;

    await db.run(createYouthTableQuery);
    await db.run(createAdultTableQuery);
    await db.run(createSeniorTableQuery);

    // Insert sample data for youth_cases
    const youthData = [
      { problem: "Bullying at school", solution: "Talk to a teacher or counselor with children care foundation with ph no.: 8745321698", severity_level: "high" },
      { problem: "Online harassment", solution: "Report the abuse to a parent or authority", severity_level: "medium" },
      { problem: "Verbal abuse by peers", solution: "Seek guidance from a trusted adult", severity_level: "low" },
      {
        problem: " I rely on abusive parents/guardians for food, shelter, and basic needs, leaving me feeling trapped",
        solution: "Share your situation with a teacher, school counselor, or trusted family member who can intervene. Report the abuse to child protective services (CPS) or similar agencies that can investigate and provide safe alternatives.Reach out to shelters specifically for minors, which offer protection and resources.",
        severity_level: "high",
      },
      {
        problem: "Adults or authorities may dismiss my reports of abuse as exaggerated or attention-seeking",
        solution: "Keep a written or digital record of incidents if safe to do so, including dates and descriptions.Reach out to professionals (e.g., teachers, doctors, counselors) who are trained to recognize signs of abuse.Continue to seek help even if the first attempts are unsuccessful—different adults or agencies may respond better.",
        severity_level: "high",
      },
      {
        problem: "The abuser prevents me from contacting friends, relatives, or outside support",
        solution: "Use school, library, or other public resources to access hotlines or email trusted adults.Take advantage of school counselors, nurses, or teachers who can connect me with outside help. Develop a safety plan with a trusted adult to leave the abusive environment if needed.",
        severity_level: "medium",
      },
      {
        problem: "I feel responsible for protecting younger siblings from abuse or fear they may be punished if I speak out",
        solution: "Report the abuse to CPS or our hotline so our professionals can ensure safety for all family members.Mention sibling concerns when seeking help to emphasize the need for family-wide intervention.If possible, involve siblings in safety planning without alarming them unnecessarily.",
        severity_level: "high",
      },
      {
        problem: "The abuser threatens that I will end up in foster care or homeless if I report the abuse",
        solution: "Understand that authorities prioritize safe placements for minors, and many foster families provide care and stability.Contact organizations like Covenant House or local shelters that assist homeless or abused youth. Reach out to extended family members who might provide a safer alternative to foster care.",
        severity_level: "medium",
      },
      {
        problem: " My dating partner is abusive, but I do not feel I have the same support as an adult survivor.",
        solution: "Call hotlines like Love Is Respect for guidance tailored to teens in abusive relationships.Many schools have peer support groups or programs focused on healthy relationships.Share your concerns with a trusted friend or adult who can help you understand the dynamics of abuse.",
        severity_level: "medium",
      },
      {
        problem: "The abuser might retaliate if I disclose abuse or seek help at school",
        solution: "Inform teachers, counselors, or administrators discreetly about your situation and concerns.Request specific protections, such as altered schedules or increased monitoring, to avoid contact with the abuser.Explore online schooling or transfers if necessary for safety.",
        severity_level: "low",
      },
      {
        problem: "The abuser tells me that reporting them will break up the family or hurt other loved ones",
        solution: "Recognize that the abuse is not your fault and that protecting yourself is not selfish.Talk to a trusted adult or our hotline to help untangle guilt from reality. Understand that addressing the abuse now can lead to healthier relationships in the future.",
        severity_level: "medium",
      },
      {
        problem: "I am unsure if what I am experiencing counts as abuse, especially if it is verbal, emotional, or financial rather than physical",
        solution: "Research different forms of abuse through resources like child abuse hotlines or portals.Contact a school counselor or our hotline to describe yur experiences and get clarity.If something feels wrong or unsafe, it is important to seek help, even if you are unsure.",
        severity_level: "low",
      },
      {
        problem: " I am afraid that seeking help will make things worse if the abuser finds out",
        solution: "Use services that protect your privacy, such as anonymous chat or text-based hotlines which are present at our services.Understand that some professionals, like teachers or doctors, are legally required to report abuse, which could lead to intervention.Work with professionals to plan for potential outcomes, including relocation or counseling.",
        severity_level: "medium",
      },
      {
        problem: "My family or community sees certain abusive behaviors as (normal) or discourages speaking out",
        solution: "Reach out to organizations that specialize in abuse cases within your cultural or religious background.Learn about your legal rights and how they override harmful cultural norms.Seek discreet help from external resources to avoid stigma while ensuring your safety.",
        severity_level: "low",
      },
      {
        problem: "I do not have money to access transportation, therapy, or basic needs if I leave the abusive environment",
        solution: "Contact local or national organizations offering free services to minors. Reach out to trusted teachers, friends parents, or community groups for temporary support.Many youth shelters provide food, clothing, and transportation assistance.",
        severity_level: "medium",
      },
      {
        problem: "I struggle to explain my situation to adults or fear they would not take me seriously",
        solution: "Create a written or recorded explanation of the abuse to share with trusted adults or authorities.Ask a counselor, teacher, or hotline operator to help communicate your concerns.",
        severity_level: "medium",
      },
      {
        problem: "Family members or others encourage me to forgive the abuser and move on without intervention",
        solution: "Prioritize your well-being over external expectations or pressure. If possible, minimize contact with those pressuring you and seek support elsewhere.",
        severity_level: "high",
      },
      {
        problem: "What should a minor do if they are facing domestic violence at home",
        solution: "Contact Childline India (1098), a helpline dedicated to helping children in distress.",
        real_world_exampe:" A 16-year-old girl faced physical and emotional abuse from her father.Delhi Teenagers Domestic Violence Case (2022)",
        severity_level: "High",
      },
      {
        problem: "How can a child facing domestic violence be removed from an abusive home environment",
        solution: "The CWC has the power to remove a child from an abusive environment and place them in a safe home.",
        real_world_exampe:"A 12-year-old girl was being physically abused by her stepfather and mother.Kerala Child Abuse Case (2020)",
        severity_level: "Medium",
      },
      {
        problem: "What should be done if a minor is being sexually abused by a family member",
        solution: "Report the case to Childline (1098) or the local police station under the POCSO Act, 2012 (Protection of Children from Sexual Offences Act).",
        real_world_exampe:"A 13-year-old girl was sexually abused by her uncle.Madhya Pradesh Sexual Abuse Case (2018)",
        severity_level: "High",
      },
      {
        problem: "How can a minor girl access legal help if she is a victim of domestic violence but does not have parental support",
        solution: "Even without parental support, minors can report cases to the police, Childline (1098), or Womens Helpline (1091).",
        real_world_exampe:"A 14-year-old girl was abused by her stepfather, but her biological mother refused to help her.",
        severity_level: "Medium",
      },
      {
        problem: "How can minors facing emotional abuse be supported if they feel isolated or neglected",
        solution: " Mental health services through NGOs or government-run schemes can provide counseling and therapy.",
        real_world_exampe:"A 15-year-old girl was emotionally abused and neglected by her mother and stepfather.Uttar Pradesh Emotional Abuse Case (2019)",
        severity_level: "Medium",
      },
      {
        problem: "What if a minor is being forced into child labor or forced marriage by their family",
        solution: "They specialize in rescuing children from forced labor and child marriage situations.File a case under the Child Labour (Prohibition and Regulation) Act, 1986, or the Prohibition of Child Marriage Act, 2006.",
        real_world_exampe:"A 16-year-old girl was being forced into marriage by her parents.Bihar Forced Marriage Case (2020)",
        severity_level: "High",
      },
      {
        problem: "How can a minor girl protect herself if she is being harassed or threatened by her abuser",
        solution: "File a complaint for criminal intimidation or harassment under Section 506 IPC.Approach NGOs that specialize in providing safe spaces and support for minors experiencing abuse.",
        real_world_exampe:"A 17-year-old girl was harassed by her uncle, who repeatedly threatened her for resisting his advances.Gujarat Harassment Case (2021)",
        severity_level: "High",
      },
      {
        problem: "What steps can be taken if a minors parents are emotionally or physically abusive but the minor is afraid to speak out",
        solution: "Reach out to Childline (1098) or a trusted adult (teacher, family member, or neighbor) to seek help.File a complaint under the Juvenile Justice Act and the Domestic Violence Act.",
        real_world_exampe:"A 15-year-old girl suffered physical and emotional abuse from her parents but was afraid to report.Mumbai Parental Abuse Case (2020)",
        severity_level: "High",
      },
      {
        problem: " What steps can be taken if a minor's parents prevent them from attending school and instead force them into child labor or household chores",
        solution: "Report the situation to Childline (1098) or the Child Welfare Committee (CWC).File a case under the Right to Education (RTE) Act, 2009.",
        real_world_exampe:"A 14-year-old boy in Uttar Pradesh was removed from school to work in his fathers shop. Authorities intervened, and he was re-enrolled in school (2019).",
        severity_level: "High",
      },
      {
        problem: " What steps can be taken if a minor is being sexually abused by a close relative but is afraid to report it",
        solution: "Ensure the minor gets trauma counseling through NGOs like RAINN or government-run child welfare programs.File a case under the POCSO Act, 2012.",
        real_world_exampe:"A 13-year-old girl in Tamil Nadu was abused by her uncle but feared reporting due to family pressure. Her teacher noticed signs of distress and filed a complaint under POCSO (2021).",
        severity_level: "High",
      },
      {
        problem: "What steps can be taken if a minor is being forced into marriage by their parents",
        solution: "File a complaint under the Prohibition of Child Marriage Act, 2006.Involve local NGOs like Kailash Satyarthi Foundation to ensure the childs safety and continuation of education.",
        real_world_exampe:"A 16-year-old girl in Rajasthan was rescued by authorities just days before her wedding (2022). Her schoolmates alerted authorities.",
        severity_level: "High",
      },
      {
        problem: "What steps can be taken if a minors parents use excessive physical punishment, leaving the child injured or traumatized",
        solution: "Report the abuse to Childline (1098) or file a complaint under the Juvenile Justice Act, 2015.Seek counseling for the child through child psychologists provided by the government or NGOs.",
        real_world_exampe:"In 2020, a 12-year-old boy in Kerala was hospitalized after severe beatings from his father for poor grades. Neighbors reported the case, and the child was placed in foster care.",
        severity_level: "High",
      },
      {
        problem: "What steps can be taken if a minors parents emotionally abuse them, causing mental health issues",
        solution: "File a complaint under the Juvenile Justice Act, 2015 for neglect and abuse.Arrange therapy through child welfare programs or NGOs like Save the Children.",
        real_world_exampe:"In 2021, a 15-year-old girl in Maharashtra developed anxiety due to constant verbal abuse from her parents. Her school stepped in and referred her to a counselor.",
        severity_level: "High",
      },
      {
        problem: "What steps can be taken if parents force their child to beg on the streets",
        solution: "Report the case to Childline (1098) or file a complaint under the Juvenile Justice Act, 2015.Enroll the child in rehabilitation and educational programs to ensure a better future.",
        real_world_exampe:"A 10-year-old boy in Bihar was rescued from forced begging in 2020. The parents were counseled, and the child was admitted to school.",
        severity_level: "High",
      },
      {
        problem: "What steps can be taken if a minor is not allowed to interact with friends or peers due to parental control",
        solution: "Involve school counselors to mediate between the parents and the child.Contact local child protection officers to assess the situation if isolation leads to psychological harm.",
        real_world_exampe:"In 2018, a 14-year-old boy in Karnataka faced isolation due to strict parental control. The school intervened, and family counseling helped resolve the issue.",
        severity_level: "Medium",
      },
      {
        problem: "What steps can be taken if parents withhold food, clothing, or healthcare from a minor as punishment",
        solution: "Report the case under the Juvenile Justice Act, 2015, for neglect and abuse.Seek immediate support from NGOs that provide basic needs and shelter for abused children.",
        real_world_exampe:"A 13-year-old girl in West Bengal was denied meals for days by her parents as punishment for small mistakes. Authorities intervened after neighbors reported the case in 2019.",
        severity_level: "High",
      },
      {
        problem: "What steps can be taken if parents neglect their child due to substance abuse or alcoholism",
        solution: "Contact child welfare services to assess the home environment and remove the child if necessary.",
        real_world_exampe:"A 9-year-old boy in Gujarat was neglected by his alcoholic father in 2021. Child Welfare Authorities intervened, and the father entered rehabilitation.",
        severity_level: "High",
      }
    ];

    for (const { problem, solution, severity_level } of youthData) {
      await db.run(`
        INSERT INTO youth_cases (problem, solution, severity_level)
        VALUES (?, ?, ?)
      `, [problem, solution, severity_level]);
    }

    // Insert sample data for adult_cases
    const adultData = [
      { problem: "Domestic physical violence", solution: "Seek legal protection and support services, with Women’s Shelter Organization with ph.no: 874521365", severity_level: "high" },
      { problem: "Financial control by partner", solution: "Consult a financial advisor and legal help", severity_level: "medium" },
      { problem: "Psychological manipulation", solution: "Reach out to a therapist or counselor", severity_level: "low" },
      {
        problem: "Finance abuse leading to isolation from family",
        solution: "Connect with local social services for financial aid.",
        severity_level: "high",
      },
      {
        problem: "Physical violence when expressing opinion",
        solution: "Consider local shelters and seek legal aid for restraining orders.",
        severity_level: "high",
      },
      {
        problem: "Restricted from working",
        solution: "Contact a local women's rights organization for work opportunities.",
        severity_level: "medium",
      },
      {
        problem: "Emotional manipulation leading to the isolation from family",
        solution: "Connect with the other survivours for emotional validation and practical advice.",
        severity_level: "high",
      },
      {
        problem: "Fear to leave or report the abuse to protect the children or the loved one from the abuser",
        solution: "Develop a safety plan with trusted friends,family and professionals with all the essentials needed and identify a safe exit stratergy.If you feel safe then file for a restrain order through our legal channel and keep the abuser away.",
        severity_level: "high",
      },
      {
        problem: " I fear the impact on my children or worry about how to protect and provide for them",
        solution: "Keep a record of incidents (photos, messages, or notes) to use as evidence in custody cases.If the abuse extends to children, report the situation to authorities or organizations that specialize in child welfare.Seek help from organizations that offer safe accommodations for mothers and children.",
        severity_level: "high",
      },
      {
        problem: "I am unsure of my legal rights or fear the justice system would not protect me",
        solution: "Our organizations offer free consultations to inform me of my rights regarding protection orders, divorce, custody, and property.Document the abuse through photos, medical records, or witness statements to strengthen any legal action. Report incidents to establish a record, even if I choose not to press charges immediately.",
        severity_level: "low",
      },
      {
        problem: " Cultural or societal norms discourage me from leaving the relationship, or I fear being judged",
        solution: "Understand that leaving an abusive situation is a brave step, not a failure. It is important for my safety and well-being.Seek help from individuals or groups within your cultural or religious background that advocate for womens rights.Use our counseling platforms that ensure privacy and confidentiality.",
        severity_level: "medium",
      },
      {
        problem: "Feeling trapped, depressed, or incapable of making decisions due to the constant abuse",
        solution: "Access trauma-informed therapy to process your experiences and rebuild your mental health.Incorporate small steps to regain your strength, such as journaling, meditation, or engaging in supportive activities.If thoughts of self-harm arise, reach out to a crisis hotline immediately.",
        severity_level: "high",
      },
      {
        problem: "My community or faith discourages separation, and leaving may lead to ostracization",
        solution: "Seek support from individuals or groups within the faith or community that advocate for womens safety and autonomy.Remind yourself that your safety and dignity are more important than societal approval, and that many faiths emphasize protecting oneself from harm.",
        severity_level: "low",
      },
      {
        problem: "The abuser threatens to take the children away or uses the legal system to maintain control",
        solution: " use our ai advocate for domestic violence and family law who can advocate for my rights.Document all incidents of abuse and threats to strengthen your case in court.Request court-ordered custody arrangements that prioritize the childrens safety.",
        severity_level: "medium",
      },
      {
        problem: " I feel guilty about leaving because of emotional ties, children, or financial dependency",
        solution: " Work with our therapist to unpack feelings of guilt and understand the dynamics of abuse.Remind yourself that prioritizing your safety and mental health is not selfish",
        severity_level: "medium",
      },
      {
        problem: "I live in a remote area with limited access to shelters or services",
        solution: "you can get acess to our counseling, legal advice, or support team.Identify someone in a nearby town or city who can act as a point of contact or refuge.Work with hotlines to create a plan for relocating to a safer area, including transportation and shelter arrangements.",
        severity_level: "medium",
      },
      {
        problem: "The abuser monitors my phone, email, or social media, making it difficult to seek help",
        solution: " Borrow a phone or computer from a trusted person or public library.Use encrypted apps or incognito browsing to reach out for help. Set up code words with trusted people to signal distress without alerting the abuser.",
        severity_level: "high",
      },
      {
        problem: " I may not fully recognize my situation as domestic violence, especially if its non-physical abuse",
        solution: "Research the various forms of abuse (emotional, financial, psychological) to understand your experience better.Read books, articles, or watch survivor stories to learn more about domestic violence.If you dont convince with your research then Contact our hotlines or counselors who can help identify abusive behaviors and validate my feelings.",
        severity_level: "medium",
      },
      {
        problem: "If I am in a same-sex relationship or identify differently, societal bias might prevent me from seeking help",
        solution: " Seek support from organizations that specialize in LGBTQ+ relationships and domestic violence.Find groups advocating for gender-inclusive approaches to domestic violence awareness.Contact hotlines that specifically cater to marginalized groups.",
        severity_level: "low",
      },
      {
        problem: "Either I or the abuser struggles with addiction or mental health, complicating the situation",
        solution: "Reach out to organizations specializing in both domestic violence and substance abuse or mental health.Address immediate safety concerns before tackling broader issues like addiction.Engage with trauma-informed therapists who understand the interplay between abuse and mental health.",
        severity_level: "medium",
      },
      {
        problem: " I worry no one will believe me because the abuser is charming or respected in the community",
        solution: "Collect evidence discreetly, such as photos, recordings, or written records of incidents.Confide in trusted individuals or professionals who can support and validate my experience.Seek help from legal and medical professionals who can provide impartial documentation of the abuse.",
        severity_level: "medium",
      },
      {
        problem: "The ongoing abuse has left me feeling too drained to act or hope for a better future",
        solution: "Focus on one manageable action at a time, such as making a single call to a hotline.Draw strength and hope from stories of others who have escaped similar situations.Engage in small acts of self-care, like breathing exercises or brief moments of joy, to rebuild emotional energy.",
        severity_level: "high",
      },
      {
        problem: " The abuser apologizes, promises to change, and I feel torn between staying and leaving",
        solution: "Understand that promises to change often form part of the (honeymoon phase) in the cycle of abuse.Require tangible actions (e.g., therapy, behavior change) before considering reconciliation. Speak with our counselor or hotline to gain perspective on the likelihood of lasting change.",
        severity_level: "medium",
      },
      {
        problem: "The abuser has power, respect, or influence in the community, making it harder to report or escape",
        solution: "Use anonymous hotlines or organizations that can investigate without revealing your identity.Contact larger or external organizations not influenced by the abuser's reputation.Document abuse carefully to counter attempts to discredit your claims.",
        severity_level: "medium",
      },
      {
        problem: "The abuser has become increasingly violent, and I fear leaving could provoke worse harm",
        solution: "Go with law enforcement trained in our domestic violence cases to ensure immediate safety. Utilize emergency relocation programs through shelters or government services.Regularly update your safety plan with input from professionals to account for increasing risks",
        severity_level: "high",
      },
      {
        problem: "Local shelters are full, or I do not have transportation to access one",
        solution: "Stay with a trusted friend or family member, even if it is a short-term solution.Some organizations provide transport to available shelters in nearby towns or cities.Use online platforms to locate less-publicized shelters or safe housing programs.",
        severity_level: "low",
      },
      {
        problem: "The abuser turns my support system against me by spreading lies or creating doubt",
        solution: "Reach out to trusted friends or family with your perspective, but only if it feels safe.Rely on professionals or new support networks if personal connections are compromised.Maintain records to counter false narratives if needed in legal or community disputes.",
        severity_level: "medium",
      },
      {
        problem: "The abuser uses the children as pawns, manipulating them or threatening to take them away",
        solution: "Seek legal custody through family courts and highlight the abusive behaviors as a safety risk. Enroll children in therapy or counseling to help them understand and cope.Avoid involving children in confrontations or discussions about leaving.",
        severity_level: "high",
      },
      {
        problem: "I fear bias in the legal system due to race, gender, or socioeconomic status",
        solution: "Work with our organizations that specialize in advocacy for marginalized communities.If you okay then, Collaborate with our lawyers or advocates to prepare compelling evidence of abuse.",
        severity_level: "low",
      },
      {
        problem: "The abuser tracks my online activities, phone calls, or location using technology",
        solution: "Use a friends phone, a public computer, or devices at a shelter to access help. Change all passwords for social media, email, and bank accounts on a secure device. Disable location sharing on devices and social media to prevent being monitored.",
        severity_level: "medium",
      },
      {
        problem: "I want to leave, but I fear for the safety of my pets, as the abuser has threatened or harmed them",
        solution: "Look for shelters or programs that accommodate pets or partner with animal organizations.Arrange temporary care for pets through trusted friends, family, or animal advocacy groups. Consider pets in your safety plan, such as gathering their medical records and food supplies.",
        severity_level: "medium",
      },
      {
        problem: "The abuser sabotages my job by stalking me at work, calling excessively, or interfering with my performance",
        solution: "Disclose the situation to a trusted supervisor or HR representative to arrange protective measures.Request workplace inclusion in restraining orders to prevent the abuser from approaching.Utilize employee assistance programs (EAP) for counseling or relocation resources.",
        severity_level: "low",
      },
      {
        problem: "The abuse has eroded my sense of independence, and I dont feel capable of managing on my own",
        solution: "Start with manageable goals, such as handling small financial transactions or making minor decisions.Join support groups where you can connect with others who have faced similar challenges. Engage in therapy to rebuild self-confidence and recognize your own strengths.",
        severity_level: "low",
      },
      {
        problem: "The abuser files false claims, such as accusing me of child neglect or other crimes",
        solution: "Go with our AI lawyer familiar with domestic violence cases who can challenge false accusations.Gather and present documentation that contradicts the abusers claims.Work with our advocacy groups that provide legal aid for survivors facing retaliatory tactics.",
        severity_level: "high",
      },
      {
        problem: "I do not fully understand the legal protections available to me or how to access them",
        solution: "Use resources like hotlines, community centers, or our AI advocate platform to understand my legal rights.Seek help from oue AI clinics specializing in domestic violence cases.",
        severity_level: "low",
      },
      {
        problem: "The abuser limits my access to healthcare, preventing me from seeking medical help for injuries or other issues",
        solution: " Disclose abuse to a trusted doctor or nurse, as they may connect me with resources or report the abuse safely.Request copies of medical records to use as evidence in legal proceedings.Seek medical care through free clinics or mobile health units if access is restricted.",
        severity_level: "medium",
      },
      {
        problem: "After leaving, I feel lost, isolated, or unsure of how to rebuild my life",
        solution: " Enroll in workshops or training programs to learn new skills and gain employment.Focus on long-term healing through therapy to process trauma and rebuild confidence.Get involved in support groups or volunteer activities to rebuild a sense of purpose and belonging.",
        severity_level: "low",
      },
      {
        problem: "The abuser forces me to engage in illegal activities, which puts me at risk of legal consequences",
        solution: "Seek legal counsel to explain my coerced participation and explore options to avoid charges.Keep records of threats or coercive actions if possible, as evidence of abuse.Contact organizations or law enforcement anonymously to disclose the abuse and coercion.",
        severity_level: "high",
      },
      {
        problem: "The abuser has influenced our mutual friends, making me feel unsupported or judged",
        solution: "Connect with survivor groups or shelters that can provide unbiased support.Avoid mutual social gatherings and focus on relationships with trustworthy individuals.Share my story only with people I deeply trust and who demonstrate understanding.",
        severity_level: "medium",
      },
      {
        problem: " The abuser threatens to reveal private information (e.g., about my past, sexuality, or personal secrets) to manipulate me",
        solution: " If safe, share the information with trusted individuals before the abuser does, to reduce its power as a weapon.Investigate legal protections against blackmail, slander, or harassment.Work with our counselor to manage the fear and shame the abuser is exploiting.",
        severity_level: "high",
      },
      {
        problem: "Work with a counselor to manage the fear and shame the abuser is exploiting",
        solution: "Enroll children in counseling to help them process their emotions and experiences.Create consistent routines and safe spaces where children can feel secure.Show children that seeking help and prioritizing safety are courageous and necessary.",
        severity_level: "low",
      },
      {
        problem: "Leaving the abuser might leave me without a place to stay or a way to afford housing",
        solution: "Contact shelters that specialize in helping abuse survivors, which often provide temporary housing.Apply for housing benefits or subsidies available to domestic violence survivors.Arrange to stay with trusted friends or family while transitioning to independent living.",
        severity_level: "low",
      },
      {
        problem: "The abuser uses my mental health history or struggles to discredit me or justify their control",
        solution: "Work with a mental health professional to address any issues and strengthen my credibility.Keep records of incidents to show how the abuser has contributed to or exploited my mental health struggles. Collaborate with lawyers or advocates experienced in cases involving mental health and domestic abuse.",
        severity_level: "medium",
      },
      {
        problem: " I rely on substances to cope with the abuse, or the abuser introduces drugs or alcohol to control me",
        solution: "Seek help from programs that address both addiction and abuse.Work with our therapist or support group to develop healthier ways to manage stress.If leaving the abuser means quitting substances, find a medically supervised detox program.",
        severity_level: "medium",
      },
      {
        problem: " I fear losing custody of my children but do not understand the legal process",
        solution: "Seek free or low-cost legal advice from family law professionals or organizations. Highlight how the abuse has affected the household to strengthen my custody case.Work with agencies specializing in child protection and domestic violence cases.",
        severity_level: "low",
      },
      {
        problem: "The abuser has convinced me that I can not live independently, manage finances, or make decisions",
        solution: " Enroll in workshops to learn budgeting, job searching, and life skills.Set small, achievable goals to build confidence in managing life independently.Lean on community resources, friends, or organizations for guidance and encouragement.",
        severity_level: "medium",
      },
      {
        problem: "As a woman of a marginalized identity (e.g., race, disability, sexual orientation), I face additional barriers to seeking help",
        solution: "Seek organizations or groups that specialize in supporting individuals with your specific identity or challenges. Partner with broader coalitions that address intersectional discrimination and abuse.Build connections in communities that affirm and validate your experiences.",
        severity_level: "high",
      },
      {
        problem: "The abuser controls my access to health insurance or medical care, leaving me without essential services",
        solution: "Find local or non-profit clinics that offer free or reduced-cost medical care.Some medical providers can bypass insurance requirements or help connect me to social services. Apply for independent healthcare coverage if available in my region.",
        severity_level: "high",
      },
      {
        problem: " The abuser controls all bank accounts, denies access to money, or sabotages my financial independence",
        solution: "Open a new bank account without the abusers knowledge.Utilize grants or emergency funds offered by domestic violence organizations.Collaborate with financial counselors experienced in domestic abuse cases.",
        severity_level: "high",
      },
      {
        problem: "What should I do if the police do not take my complaint seriously or delay action",
        solution: "If the police do not take action, women can escalate their complaints to the Superintendent of Police (SP) or file a complaint with the National Commission for Women (NCW) or State Womens Commission.",
        real_world_example:"women face indifference or even dismissal from law enforcement when reporting domestic violence, especially in rural areas. The police might downplay the seriousness of the situation or be influenced by family pressure.",
        severity_level: "low",
      },
      {
        problem: "How can I protect my children if my partner threatens them",
        solution: "The Protection of Women from Domestic Violence Act can be used to obtain protection orders for children as well. Women can request the court to prohibit the abuser from interacting with or harming the children.",
        real_world_example:"Abusers often use children as a means of control or as emotional leverage. They may threaten to harm the children or deny the mother custody.",
        severity_level: "medium",
      },
      {
        problem: "What can I do if my abuser is the sole breadwinner in the family, and I am economically dependent",
        solution: " If the woman decides to separate or divorce, the Hindu Marriage Act (1955), Muslim Women (Protection of Rights on Divorce) Act (1986), and other personal laws allow women to claim maintenance or alimony for themselves and their children.",
        real_world_example:"Many women stay in abusive relationships because they have no access to financial resources. Economic dependency is a significant barrier, especially if the abuser is the sole provider.",
        severity_level: "medium",
      },
     {
      problem: "What legal remedies are available to protect women from domestic violence",
      solution: "Protection of Women from Domestic Violence Act, 2005: Provides protection orders, residence rights, and monetary relief.",
      real_world_exampe:"Nisha Sharma Dowry Case (2003)",
      severity_level: "low",
    },
    {
      problem: "How can women access immediate help in cases of domestic violence",
      solution: "Call helplines like 181, 112 (Emergency Response), or local womens cells in police stations.",
      real_world_exampe:"a young medical student, faced dowry harassment and eventually died by suicide.",
      severity_level: "high",
    },
    {
      problem: "What societal measures can prevent domestic violence",
      solution: "Educate communities about gender equality and the consequences of domestic violence.",
      real_world_exampe:" Many women anonymously shared their domestic violence stories online, exposing abusers and bringing awareness to hidden abuse.",
      severity_level: "medium",
    },
    {
      problem: "What steps can financially dependent women take to escape domestic violence",
      solution: "Approach NGOs or government programs like Swadhar Greh to access financial aid and skill development.",
      real_world_exampe:"A financially dependent woman suffered years of physical abuse from her husband.",
      severity_level: "medium",
    },
    {
      problem: "What reforms are needed to better address domestic violence cases",
      solution: "Strengthen the enforcement of existing laws like the Domestic Violence Act and Dowry Prohibition Act.",
      real_world_exampe:"A woman faced domestic violence and later survived an acid attack by her husband.",
      severity_level: "medium",
    },
    {
      problem: "How can emotional abuse in domestic relationships be addressed",
      solution: "File a case under the Protection of Women from Domestic Violence Act, 2005, which recognizes emotional, verbal, and psychological abuse.",
      real_world_exampe:"A prominent actress filed a complaint alleging emotional and verbal abuse by her husband.",
      severity_level: "low",
    },
    {
      problem: "How can women protect themselves from financial abuse in domestic settings",
      solution: "File for maintenance or monetary compensation under the Domestic Violence Act or Section 125 of the Criminal Procedure Code (CrPC).",
      real_world_exampe:"A homemaker was denied financial support and access to joint bank accounts by her abusive husband.",
      severity_level: "low",
    },
    {
      problem: "What steps can women take if their children are affected by domestic violence",
      solution: "File for custody of children under the Domestic Violence Act, 2005 or Guardians and Wards Act, 1890.",
      real_world_exampe:"A woman filed for custody of her children after suffering abuse from her husband, fearing for their safety.",
      severity_level: "medium",
    },
    {
      problem: "How can rural women, who face limited access to resources, tackle domestic violence",
      solution: "Use village-level resources like Mahila Panchayats or womens self-help groups to mediate and address issues.",
      real_world_exampe:"A rural woman was repeatedly abused by her husband but had no resources to leave.",
      severity_level: "high",
    },
    {
      problem: "What legal recourse is available for women suffering dowry-related violence",
      solution: "Section 498A of IPC: Criminalizes cruelty by husband/in-laws over dowry.",
      real_world_exampe:" Vismaya, a 24-year-old woman, faced severe dowry harassment, leading to her suicide.",
      severity_level: "high",
    },
    {
      problem: "How can women protect themselves from repeated violence after leaving their abusers",
      solution: "Obtain a protection order under the Domestic Violence Act to prohibit the abuser from contacting the victim.",
      real_world_exampe:" A woman left her abusive husband but was stalked and threatened repeatedly.",
      severity_level: "high",
    },
    {
      problem: "How can workplace abuse caused by domestic violence be addressed",
      solution: "Report workplace harassment under the Sexual Harassment of Women at Workplace Act, 2013 if domestic abuse spills into the workplace.",
      real_world_exampe:"A woman faced abuse at home, which affected her performance and led to harassment by her manager.",
      severity_level: "medium",
    },
    {
      problem: "How can communities help prevent domestic violence",
      solution: "Organize workshops on gender equality and laws against domestic violence.",
      real_world_exampe:"Villagers formed a womens collective to address cases of domestic violence.",
      severity_level: "low",
    },
    {
      problem: "How can domestic violence laws be strengthened to better protect women.",
      solution: "Fast-tracking domestic violence cases in courts.",
      real_world_exampe:"The Supreme Court issued guidelines to prevent misuse of dowry laws while ensuring genuine cases are fast-tracked.",
      severity_level: "low",
    },
    {
      problem: "How can women combat digital abuse and stalking by intimate partners",
      solution: "Section 354D IPC: Criminalizes stalking, including online harassment.",
      real_world_exampe:"A woman was harassed by her ex-partner through threatening emails and social media messages.",
      severity_level: "high",
    },
    {
      problem: "How can domestic violence survivors secure long-term financial independence",
      solution: "Enroll in skill-development programs offered by NGOs and government schemes like STEP (Support to Training and Employment Program for Women).",
      real_world_exampe:" A domestic violence survivor used government funding to start a tailoring business.",
      severity_level: "medium",
    },
    {
      problem: "How can a woman overcome societal stigma and mental health issues caused by domestic violence",
      solution: "Access therapy and counseling through organizations like Snehi or Sakhi One-Stop Centers.",
      real_world_exampe:"A woman faced emotional abuse but hesitated to leave due to societal stigma.",
      severity_level: "low",
    },
    {
      problem: "What recourse is available for women facing honor-based violence",
      solution: "Section 307 IPC (attempt to murder) or Section 302 IPC (murder in honor killings).",
      real_world_exampe:"A couple was murdered by their families for marrying within the same caste.",
      severity_level: "medium",
    },
    {
      problem: "What should women do if family members or relatives are perpetrators of domestic violence",
      solution: "File a case under the Domestic Violence Act, which applies to violence by relatives.",
      real_world_exampe:"A woman faced harassment from her brother-in-law and sought legal action.",
      severity_level: "medium",
    },
    {
      problem: "How can LGBTQ+ individuals address domestic violence in same-sex relationships",
      solution: "Approach NGOs like Humsafar Trust and Naz Foundation that provide legal and emotional support to LGBTQ+ individuals.",
      real_world_exampe:"A man faced abuse from his same-sex partner and sought help from an LGBTQ+ support group.",
      severity_level: "high",
    },
    {
      problem: "How can women tackle marital rape in India",
      solution: "Protection of Women from Domestic Violence Act, 2005 for emotional and physical abuse.",
      real_world_exampe:"Survivors filed a petition challenging the exception of marital rape under Indian law.",
      severity_level: "high",
    },
    {
      problem: "What can women do if the police refuse to register domestic violence complaints",
      solution: "Approach higher authorities like the Superintendent of Police (SP) or file an online FIR through state police portals.",
      real_world_exampe:" A domestic violence survivor faced inaction from local police after repeated complaints.",
      severity_level: "high",
    },
    {
      problem: "How can women ensure the safety of their children in cases of domestic violence",
      solution: "File for custody of children under the Guardians and Wards Act, 1890, or the Domestic Violence Act, 2005.",
      real_world_exampe:"A mother filed for custody of her children after suffering abuse at the hands of her husband.",
      severity_level: "high",
    },
    {
      problem: "What should women do if they face threats of murder or physical harm by their abusers",
      solution: "File a complaint under Section 307 IPC (attempt to murder) or Section 302 IPC (murder).",
      real_world_exampe:"A woman received multiple threats of murder from her husband.",
      severity_level: "medium",
    },
    {
      problem: "How can women protect themselves if their abuser has significant economic power or influence",
      solution: "Approach legal aid organizations that offer free services to help women fight cases against powerful abusers.",
      real_world_exampe:"A woman in a relationship with a powerful businessman faced constant financial control and abuse.",
      severity_level: "high",
    },
    {
      problem: "How can women get support if they fear being disbelieved by family or friends regarding their abuse",
      solution: "Document the abuse: Maintain a record of abusive incidents, including photos of injuries, audio recordings, or written documentation.",
      real_world_exampe:"A woman faced physical abuse and initially struggled to convince her family and friends.",
      severity_level: "medium",
    },
    {
      problem: "What recourse is available for women facing violence in relationships with non-marital partners",
      solution: "Protection of Women from Domestic Violence Act, 2005 applies to relationships in the nature of marriage, meaning unmarried couples can also seek protection.",
      real_world_exampe:"A woman in a live-in relationship faced emotional and physical abuse from her partner.",
      severity_level: "medium",
    },
    {
      problem: "What can women do if they face intimidation or threats from their abuses family members",
      solution: "File for a protection order under the Domestic Violence Act, which also covers threats from in-laws and extended family.",
      real_world_exampe:"A woman faced threats and intimidation from her in-laws to force her back into the abusive relationship.",
      severity_level: "high",
    },
    {
      problem: "How can women protect their privacy and secure their digital safety after fleeing an abusive relationship",
      solution: "Change all passwords for social media, emails, and banking accounts.",
      real_world_exampe:"Chennai Stalking and Online Abuse Case (2021)A womans abusive ex-partner stalked her through social media and hacked her phone to monitor her movements.",
      severity_level: "low",
    },
    {
      problem: "What should women do if they face retaliation from their abuser for reporting domestic violence",
      solution: "Document any retaliation through photos, videos, or witnesses.",
      severity_level: "high",
    }
    ];

    for (const { problem, solution, severity_level } of adultData) {
      await db.run(`
        INSERT INTO adult_cases (problem, solution, severity_level)
        VALUES (?, ?, ?)
      `, [problem, solution, severity_level]);
    }

    // Insert sample data for senior_cases
    const seniorData = [
      {
        problem: "Domestic Violence", solution: "Contact SeniorHelpFoundation with contact number 8745963212", severity_level: "High"
      },
      { problem: "Neglect by family members", solution: "Contact eldercare services and report neglect and contact senior citizen support with phone number: 8745213691", severity_level: "high" },
      { problem: "Isolation from family", solution: "Reach out to a local senior community center", severity_level: "medium" },
      { problem: "Abuse from caregivers", solution: "Report to authorities and seek assistance", severity_level: "high" },
      {
        problem: "Age-related health issues, mobility problems, or disabilities make it harder to escape or defend against abuse",
        solution: "Notify healthcare providers, who are often trained to recognize abuse in older adults and can help connect me to resources.Develop a safety plan that accounts for mobility aids and medical needs.Reach out to shelters with accommodations for seniors or those with disabilities, contact Legal Aid Foundation with phone no.: 9874525412",
        severity_level: "high",
      },
      {
        problem: " I rely on the abuser (spouse, adult child, or caregiver) for financial support and fear losing my home or income",
        solution: "Contact organizations that specialize in financial abuse of seniors for advice on managing or recovering funds.Apply for programs like Social Security, pensions, or housing assistance to regain financial independence.Seek legal aid to regain control over finances, bank accounts, or property.",
        severity_level: "high",
      },
      {
        problem: "The abuser uses emotional manipulation or gaslighting, making me doubt my reality or feel unworthy of help",
        solution: "Work with a counselor specializing in elder abuse to regain confidence and clarity. Keep a journal or record of abusive incidents to validate my experiences and seek help.Join support groups for older adults experiencing abuse to find understanding and encouragement.",
        severity_level: "high",
      },
      {
        problem: "I am cut off from friends, family, or community activities, leaving me dependent on the abuser",
        solution: "Reach out to senior centers or faith-based organizations for companionship and support.Contact trusted friends or relatives, even if the relationship has been distant.Use technology (e.g., video calls or senior-friendly apps) to connect with others safely.",
        severity_level: "medium",
      },
      {
        problem: "My caregiver (spouse, adult child, or hired help) neglects or mistreats me while controlling access to care",
        solution: "Notify Adult Protect Service or similar organizations that investigate elder abuse and provide protection.Seek assistance from local agencies or charities to arrange alternative caregiving options.Involve doctors or social workers in addressing caregiving concerns.",
        severity_level: "medium",
      },
      {
        problem: "I am afraid the abuser will retaliate if I report them or try to leave",
        solution: "Use elder abuse hotlines or APS(adult protect services) to report abuse without alerting the abuser.Work with advocates to create a step-by-step plan to leave safely and access emergency support.Consider legal protection, such as restraining orders, tailored for older adults.",
        severity_level: "low",
      },
      {
        problem: "I rely on the abuser for managing medications, transportation to medical appointments, or daily care",
        solution: " Access programs offering home healthcare services or volunteer transportation.Discuss the abuse with medical providers, who can help coordinate alternative care plans.Contact local elder advocacy organizations for assistance in managing health-related needs.",
        severity_level: "low",
      },
      {
        problem: "Cultural norms or personal pride make me hesitant to admit I am experiencing abuse, especially from a family member.",
        solution: "Seek help from organizations that understand and respect yoour cultural or personal values.Use hotlines or online chat services provided in our services to share your situation without fear of judgment.Reframe seeking help as a necessary step for your health and safety.",
        severity_level: "medium",
      },
      {
        problem: "I worry that reporting abuse may result in losing my home, autonomy, or decision-making power",
        solution: "Work with legal advisors to protect your autonomy while addressing abuse.Explore home modification programs or caregiving alternatives to maintain independence.Seek therapy focused on rebuilding confidence and assertiveness.",
        severity_level: "high",
      },
      {
        problem: "My adult child exploits me financially, emotionally, or physically, and I feel conflicted about reporting them",
        solution: "Work with a counselor to establish healthy boundaries with my child.Seek help from family mediators, social workers, or legal advocates.Recognize that protecting myself from harm benefits both you and the family as a whole.",
        severity_level: "high",
      },
      {
        problem: "he abuser monitors my phone, email, or social media to control or intimidate me",
        solution: "Ask trusted individuals or senior-focused organizations for help securing your devices.Use public computers or phones to contact hotlines or trusted people discreetly. Change passwords and enable two-factor authentication to regain control of your accounts.",
        severity_level: "high",
      },
      {
        problem: "Memory loss or cognitive issues make it difficult for me to remember or articulate abusive incidents",
        solution: "Enlist trusted individuals (e.g., caregivers, neighbors) to help monitor and report abuse.Arrange routine visits or calls with social workers or family members to detect patterns of abuse.Work with doctors to distinguish between cognitive decline and the psychological impact of abuse.",
        severity_level: "medium",
      },
      {
        problem: "My cultural or religious community discourages speaking out or considers enduring abuse a virtue",
        solution: "Seek support from spiritual leaders who understand and condemn abuse.Contact organizations serving seniors from your cultural or religious background.Work with a counselor to reconcile my values with the need to protect yourself.",
        severity_level: "high",
      },
      {
        problem: " I do not know who to trust, or I fear the authorities will dismiss my concerns",
        solution: "Share your situation with doctors, social workers, or senior advocates who are obligated to report abuse.Use elder abuse hotlines to explore options anonymously before taking action.Enlist the help of multiple agencies or professionals to ensure my case is taken seriously.",
        severity_level: "low",
      },
      {
        problem: "Leaving the abuser may mean losing access to my family, home, or long-time community",
        solution: "Look into affordable housing for seniors or co-housing communities for companionship.Join senior-specific support groups to rebuild a sense of community and belonging.Work with a therapist to cope with grief and rebuild your life in a healthier environment.",
        severity_level: "medium",
      },
      {
        problem: "Elderly Woman Abandoned by Family Members",
        solution: "Contact local social welfare services like Old Age Homes or NGOs like HelpAge India for immediate shelter and care.",
        real_world_exampe:"In 2020, a 70-year-old woman in Uttar Pradesh was abandoned by her children. Authorities intervened after a neighbor alerted them, and she was placed in an old age home.",
        severity_level: "High",
      },
      {
        problem: "Physical Abuse by Adult Children",
        solution: "Report the abuse to local authorities or the Police under the Domestic Violence Act, 2005.Seek immediate shelter and protection through NGOs like HelpAge India, which offer safe spaces for elderly victims.",
        real_world_exampe:"An elderly woman in Rajasthan suffered physical abuse by her son. She reported the abuse to the police, and a restraining order was issued while she was placed under the care of a local shelter.",
        severity_level: "High",
      },
      {
        problem: "Elderly Woman Facing Financial Exploitation",
        solution: "File a complaint under the Maintenance and Welfare of Parents and Senior Citizens Act, 2007, which ensures financial support from children.Seek assistance from local NGOs offering legal aid for senior citizens or visit government offices for financial aid schemes phone no: 8796415232",
        real_world_exampe:"A 75-year-old woman in Delhi was being exploited financially by her son, who controlled all her assets. She reached out to HelpAge India, and legal action was taken to secure her finances.",
        severity_level: "medium",
      },
      {
        problem: "Social Isolation Due to Age",
        solution: "Connect with community centers, old age homes, or NGOs that run activities for elderly people, such as Senior Citizens Associations or Elderly Welfare Clubs.Encourage the elderly woman to join community programs or attend therapy sessions to reduce loneliness and improve social engagement.",
        real_world_exampe:"A 68-year-old woman in Mumbai felt isolated after the death of her husband. She joined a community group supported by HelpAge India, which offered social engagement activities and mental wellness support.",
        severity_level: "medium",
      },
      {
        problem: "Elderly Woman Denied Healthcare by Family",
        solution: "Report the neglect to local authorities or child welfare departments for immediate medical attention.Contact Government Health Services or NGO-run medical assistance programs that offer free or subsidized healthcare for the elderly.",
        real_world_exampe:"A 72-year-old woman in Karnataka was denied healthcare by her family despite chronic health issues. She reached out to local authorities, and social workers ensured she received the required medical care.",
        severity_level: "High",
      },
      {
        problem: "Elderly Woman Subjected to Neglect in Old Age Home",
        solution: "Report the neglect to the National Human Rights Commission (NHRC) or State Senior Citizens Commission.Encourage the elderly woman to move to a different, more reputable old age home or receive home-based care if possible.",
        real_world_exampe:"In 2019, an elderly woman was found to be neglected in an old age home in Kolkata. After a complaint was filed by a relative, the woman was transferred to a better facility, and the home was investigated.",
        severity_level: "High",
      },
      {
        problem: "Woman Denied Property Rights",
        solution: "Seek legal support to file a case under the Maintenance and Welfare of Parents and Senior Citizens Act, 2007.Provide financial counseling and legal aid to secure her rightful property.",
        real_world_exampe:"In 2018, a 70-year-old woman in Bihar was denied access to her inherited property by her son. She sought legal aid, and the court ruled in her favor, restoring her property rights.",
        severity_level: "medium",
      },
      {
        problem: " Woman Suffering from Mental Health Issues Due to Isolation",
        solution: "Encourage the woman to connect with local senior citizens' groups, and old age homes that offer mental health support.Provide counseling services to help her deal with depression, anxiety, or other mental health challenges.",
        real_world_exampe:" In 2019, a 68-year-old woman in Kerala was suffering from depression due to isolation after her children moved abroad. She joined a senior citizens' support group which provided counseling and companionship.",
        severity_level: "medium",
      },
      {
        problem: "Woman With No Legal Guardian or Caregiver",
        solution: "Report the situation to the District Welfare Office or Child Welfare Committee (CWC), who can help find a guardian or place her in a well-run old age home.Facilitate legal help to create a will or assign a guardian under the Senior Citizens Welfare Act.",
        real_world_exampe:"In 2020, a 78-year-old woman in Rajasthan was living alone with no relatives. Local authorities intervened and placed her in a government-funded senior citizens' shelter.",
        severity_level: "High",
      },
      {
        problem: "Woman Living with Chronic Illness Without Medical Assistance",
        solution: "Contact local hospitals or National Health Mission (NHM) for free or subsidized medical care.Seek support from NGOs that provide healthcare assistance for senior citizens, such as Agewell Foundation or HelpAge India.",
        real_world_exampe:"A 70-year-old woman in Uttar Pradesh with diabetes was not receiving medical care due to family neglect. Authorities intervened, and she received treatment from a local hospital under a government scheme.",
        severity_level: "High",
      },
      {
        problem: " Financial Exploitation by Family Members",
        solution: "Report the financial abuse to the police or file a complaint under the Maintenance and Welfare of Parents and Senior Citizens Act, 2007.Seek legal aid from senior citizens' welfare organizations, such as HelpAge India, to recover assets and financial rights.",
        real_world_exampe:"In 2021, a 72-year-old woman in Delhi discovered that her children had been withdrawing money from her account without her consent. Legal action was taken, and she regained control of her finances.",
        severity_level: "High",
      },
      {
        problem: "Woman Facing Domestic Violence by Spouse",
        solution: "File a case under the Domestic Violence Act, 2005 to get a protection order and ensure immediate safety.Seek shelter in a women's refuge or old age home, where physical and emotional support is provided.",
        real_world_exampe:"A 65-year-old woman in West Bengal was physically abused by her alcoholic husband. She contacted a local NGO, which helped her file a domestic violence case, and she was moved to a shelter.",
        severity_level: "High",
      },{
        problem: "Woman Forced to Work Due to Lack of Financial Security",
        solution: "Report the situation to the District Welfare Officer to ensure she is receiving any eligible government pension or financial aid.Assist in applying for the Indira Gandhi National Old Age Pension Scheme (IGNOAPS).",
        real_world_exampe:" A 74-year-old woman in Haryana was forced to work as a daily wage laborer due to a lack of financial support. Local authorities helped her apply for a pension, and she received financial assistance.",
        severity_level: "medium",
      },
      {
        problem: "Woman Facing Property Dispute",
        solution: "Seek legal assistance to resolve property disputes through the courts, and ensure the womans property rights are respected.File a complaint under the Senior Citizens Welfare Act, 2007, to claim ownership or rights to the property.",
        real_world_exampe:"A 80-year-old woman in Maharashtra was facing property disputes with her children. Legal support was provided, and the woman was able to reclaim her rights to the property.",
        severity_level: "medium",
      },{
        problem: "Elderly Woman Facing Neglect and Malnutrition",
        solution: "Contact local social services or NGOs to assess the living conditions and provide the necessary nutrition and health care.Ensure the woman is enrolled in government nutrition programs such as the Integrated Child Development Services (ICDS) or Midday Meal Scheme.",
        real_world_exampe:"A 67-year-old woman in Odisha was found malnourished and neglected. Local authorities intervened, and she was provided with proper nutrition and healthcare through a nearby shelter.",
        severity_level: "High",
      },

      {
        problem: "Woman Living in Unhygienic Conditions Due to Lack of Support",
        solution: "Report the unhygienic living conditions to local welfare officers or social services for immediate intervention.Enlist the support of community groups or senior citizens' associations to help clean the living space and provide necessary hygiene products.",
        real_world_exampe:"In 2020, a 73-year-old woman in Mumbai was found living in unsanitary conditions by her neighbors. She was placed in an old age home, and her living conditions were improved.",
        severity_level: "medium",
      },{
        problem: "Elderly Woman Unable to Afford Basic Needs (Food, Medication)",
        solution: "Contact local government schemes like the Indira Gandhi National Old Age Pension Scheme (IGNOAPS) for monthly financial aid.",
        real_world_exampe:"In 2021, a 78-year-old woman in Mumbai was struggling to afford basic needs and medication. She applied for the IGNOAPS pension, and HelpAge India helped her access free healthcare.",
        severity_level: "High",
      },

      {
        problem: "Woman Denied Emotional Support by Family",
        solution: "Report the issue to the local District Social Welfare Office to seek a mediator or counselor who can address family conflicts.",
        real_world_exampe:"A 69-year-old woman in Tamil Nadu was emotionally neglected by her children. Local social services helped organize family counseling, and she joined a senior citizens' support group.",
        severity_level: "medium",
      },{
        problem: "Elderly Woman in Need of Rehabilitation after Stroke or Injury",
        solution: "Contact local hospitals or rehabilitation centers that offer geriatric care and physiotherapy for elderly patients.Explore government schemes for free or subsidized rehabilitation services for senior citizens.",
        real_world_exampe:" A 74-year-old woman in Rajasthan suffered a stroke and needed rehabilitation. She was enrolled in a local rehabilitation center through a government health scheme and received home-care assistance.",
        severity_level: "High",
      }
    ];

    for (const { problem, solution, severity_level } of seniorData) {
      await db.run(`
        INSERT INTO senior_cases (problem, solution, severity_level)
        VALUES (?, ?, ?)
      `, [problem, solution, severity_level]);
    }

    console.log("Sample data inserted into the database.");
  } catch (error) {
    console.error(`Database initialization error: ${error.message}`);
    process.exit(1);
  }
};

// Function to get the table name based on the age
const getTableNameBasedOnAge = (age) => {
  if (age <= 18) {
    return "youth_cases";
  } else if (age <= 60) {
    return "adult_cases";
  } else {
    return "senior_cases";
  }
};

// Function to retrieve the solution from the database based on age and user question
const getAnswerFromDB = async (user_question, age) => {
  const table = getTableNameBasedOnAge(age);

  try {
    const query = `
      SELECT solution 
      FROM ${table} 
      WHERE problem LIKE ? COLLATE NOCASE;
    `;
    const row = await db.get(query, [`%${user_question}%`]);
    return row ? row.solution : "Sorry, I couldn't find an answer.";
  } catch (error) {
    console.error("Error querying the database:", error.message);
    return "Sorry, there was an error fetching the data.";
  }
};

// Route to serve the main page
app.get("/", (req, res) => {
  res.render("index", { answer: null }); // Render the template with no answer initially
});

// Route to handle form submissions and fetch an answer from the database
app.post("/get_response", async (req, res) => {
  const userQuestion = req.body.user_question; // Retrieve the question from the form
  const age = parseInt(req.body.age); // Retrieve the age from the form
  const answer = await getAnswerFromDB(userQuestion, age); // Fetch the answer asynchronously based on age
  res.json({ answer }); // Render the answer in the response
});

// Initialize the database and server
const initializeDBAndServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
};

// Call the function to initialize the database and server
initializeDBAndServer();
  