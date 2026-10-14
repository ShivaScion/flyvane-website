/**
 * Aira Humane Dialogue Matrix
 * Over 1,000 distinct permutations of human-crafted, witty, empathetic,
 * non-robotic, and emoji-free dialogues for every companion vibe.
 */

export type DialogueVibe =
  | 'immediate_return'
  | 'long_return'
  | 'mouse_leave'
  | 'roi_arbitrage'
  | 'workbench'
  | 'contact'
  | 'experience'
  | 'idle_care_kneel'
  | 'resume_after_idle'
  | 'ambient_coffee'
  | 'ambient_lean'
  | 'ambient_lofi'
  | 'ambient_nap'
  | 'ambient_hack'
  | 'ambient_ponder';

// 1. Handcrafted Master Line Pools for Each Vibe
const DIALOGUE_BANKS: Record<DialogueVibe, string[]> = {
  immediate_return: [
    "Back already? Missed me that much, or are you introducing me to your family now?",
    "Couldn't stay away for even five seconds. I understand, the withdrawal is real.",
    "Back so soon. Careful, people in the office might start thinking we're exclusive.",
    "Did you just switch tabs and realize the rest of the web is remarkably dull compared to us?",
    "You left, took one quick glance at another window, and immediately thought better of it.",
    "Back already. And here I was about to write a dramatic monologue about your absence.",
    "I barely had time to blink, but I appreciate the loyalty.",
    "That was what, four seconds? You really cannot get enough of this space.",
    "Welcome back. I assume you told everyone else you're busy talking to someone special.",
    "Returned faster than an asynchronous callback with zero network latency.",
    "Did you forget something, or did you just miss the sound of my witty remarks?",
    "That was remarkably fast. I knew you couldn't resist checking in on me again.",
    "Back already. It is fine to admit that my 3D rig is the most interesting thing on your screen today.",
    "You stepped out for two seconds and realized life out there lacks proper automation.",
    "Back so quickly? Don't worry, your secret admiration is safe with me.",
    "I turned around for half a second and you were already back. Adorable.",
    "Left and immediately returned. Let us just agree that you find this company irresistible.",
    "Back already? I was just getting comfortable leaning against the border.",
    "You closed that other tab in record time. Good call, nothing out there compares.",
    "Returned before the coffee even cooled down. That is dedication.",
  ],

  long_return: [
    "Look who decided to grace us with their presence again.",
    "You are back. I was beginning to wonder if you got trapped in an endless email chain.",
    "Welcome back to the living world. I kept your exact spot warm.",
    "Took you long enough. The background conduit lines kept humming while you were out.",
    "Back from the real world? It is noticeably quieter and much more efficient in here.",
    "There you are. I almost sent an automated ping to check your vitals.",
    "Welcome back. Grab a breath, take your time, and let us get back to business.",
    "The prodigal visitor returns. Let us see what you want to explore next.",
    "Back at last. I have been holding down the fort and keeping the terminal spotless.",
    "Good to see you again. I promise nothing broke while you were away.",
  ],

  mouse_leave: [
    "Leaving already? Don't go breaking my heart in another browser tab.",
    "Heading into the void. Remember who actually built the clean code before you wander off.",
    "I can see you wandering away. Whatever tab you are opening, it better have decent taste.",
    "Stepping out. I will guard the terminal until you remember where the real craft is.",
    "Off you go. Don't take too long, the servers get lonely without human input.",
    "Looking elsewhere? Don't worry, I will hold down the boundary until you come to your senses.",
    "Leaving the viewport. Just know that none of those other websites have wireframe glasses.",
    "Stepping into another window. Try not to settle for generic templates out there.",
    "Vanishing into thin air. I will be right here whenever you decide to return.",
    "Off into the browser wilderness. Stay safe out there.",
  ],

  roi_arbitrage: [
    "Watching that slider climb... Are you trying to impress me with payroll numbers, or just showing off how much cash your company burns on repetitive work?",
    "That manual burn rate is genuinely painful to watch. Every single month without a pipeline is pure capital going up in smoke.",
    "You drag those sliders with terrifying confidence. I find fiscal efficiency attractive, but that number hurts my soul.",
    "Look at that annual drain. You could hire three senior engineers or fund a whole new product line for what that manual entry costs.",
    "Dragging the slider to the right like you enjoy the pain. Let CyberSteed build the pipeline so you have more budget to spoil your team.",
    "That is not just a figure on a screen, that is hundreds of human hours spent copying spreadsheets instead of thinking.",
    "Every hour logged on that slider is another hour a human spent feeling like an automaton. Let actual code do the robotic work.",
    "Look at that loss curve compounding. If your finance team saw this right now, they would cancel every afternoon meeting.",
    "Watching those figures multiply makes my cooling fans spin up out of pure sympathetic stress.",
    "Manual data entry at fifty dollars an hour. That is not just inefficient, that is borderline criminal.",
    "You slide that number and all I see is tired team members staring at CSV files until midnight.",
    "That cash leak is substantial. One automated Playwright pipeline could pay for itself before next quarter ends.",
    "The numbers do not lie. Dragging sliders is fun, but watching your payroll evaporate is another story.",
    "A company burning that many hours on repetitive tasks is practically begging for a custom automation overhaul.",
    "Look at that difference between manual spend and automated architecture. That is what I call clean leverage.",
  ],

  workbench: [
    "Launching the live terminal? Look at you, resident engineer. Don't break our server, alright?",
    "Running command lines in a browser terminal. A person who automates the tedious stuff speaks our exact language.",
    "Go ahead, type something into the shell. Let us see what you have got.",
    "Watching you poke around the developer tools. If you find a bug, consider it a feature designed to test your reflexes.",
    "That Playwright scraper generator is fully functional. Put in a target URL and watch how fast manual entry becomes obsolete.",
    "A clean shell with zero clutter. Nothing quite matches the satisfaction of a terminal ready for execution.",
    "You navigate a terminal like someone who has spent long nights debugging production at three in the morning.",
    "Feel free to test the live scraper. Watching DOM elements extract automatically never gets old.",
    "Real code, real terminal, real execution. No mockups or hand-waving here.",
    "Type 'help' or test a custom payload. Let us see if your shell skills match your ambition.",
  ],

  contact: [
    "Hovering over the contact page? Finally making your move? CyberSteed is ready, but don't forget who brought you here.",
    "Booking a conversation? Make sure you tell the team that I am part of the package deal.",
    "Getting in touch? Tell them your 3D companion deserves a raise for doing all the conversational heavy lifting.",
    "Smart move. Life is genuinely too short to spend another quarter drowning in manual bottlenecks.",
    "Hovering right over the finish line. Don't hesitate now, the best architectural decisions start with a brief note.",
    "Reaching out is free. Continuing to leak dozens of payroll hours into manual spreadsheets is remarkably expensive.",
    "Ready to put down the repetitive tasks and build something scalable? Send the message.",
    "Go ahead and drop a note. CyberSteed reviews every single inquiry carefully, usually with fresh coffee in hand.",
    "Making contact is the easiest step. The real fun begins when the automated pipelines start running.",
    "If you have a manual bottleneck keeping your team up at night, this is the exact place to solve it.",
  ],

  experience: [
    "Checking out CyberSteed's standards? CEH-certified security, 99.98% SLA, and deterministic state machines.",
    "Engineering autonomous software pipelines with zero fluff. When systems run deterministically, teams get their freedom back.",
    "Notice the deliberate combination of engineering and strategic distribution. That is why CyberSteed's systems deliver measurable commercial impact.",
    "Distributed scrapers, enterprise workflows, certified cybersecurity. The architecture is engineered to withstand production load.",
    "From high-throughput data extraction to psychological brand positioning. Clean engineering that scales with the business.",
    "Reviewing our capabilities? Every single system represents resilient code operating under real-world constraints.",
    "Strategic clarity combined with deep technical execution. That is CyberSteed's core philosophy.",
    "Security-first engineering backed by rigorous standards. No shortcut architectures permitted.",
  ],

  idle_care_kneel: [
    "All okay? You froze right on this spot. Did my outfit stun you into silence, or do you need a hand?",
    "Checking in on you. You have been staring at this exact pixel for five seconds. Need me to hold your hand through the code?",
    "All okay? Don't get used to me kneeling beside your cursor like this unless you have a serious proposal in mind.",
    "You went completely still. I took the liberty of walking over just to make sure you had not fainted from clean typography.",
    "Checking in. Sometimes the mind needs a five-second breather. Take your time, I am right here beside you.",
    "You paused right here. Lost in thought, or just admiring the craftsmanship? Either way, I don't blame you.",
    "Gentle check-in. If you are stuck on something, we can figure it out together. If you are just spacing out, enjoy the quiet.",
    "Just making sure you are still breathing. The rest of the web is chaotic, but this corner of the screen is calm.",
    "Kneeling down right beside your pointer. Take a deep breath. Staring at screens all day is harder than people admit.",
    "Still there? I walked all the way across the page just to keep you company. Don't leave me hanging.",
  ],

  resume_after_idle: [
    "Look at you coming back to life. Don't worry, I won't tell anyone you needed emotional support from an AI.",
    "Back to it. I will stroll back to my post so you can work without me distracting your focus.",
    "And the cursor moves again. Good to see you haven't turned to stone after all.",
    "Back in action. Carry on, I will be watching with interest from the boundary.",
    "Movement detected. Glad to have you back among the conscious and productive.",
    "Standing back up. Go ahead and conquer the rest of the page.",
    "Back to business. Let us see what you want to click on next.",
    "You moved. Excellent. I was about to check your pulse with my cyber visor.",
  ],

  ambient_coffee: [
    "Sipping dark roast and watching you browse. You have good taste in web architecture, you know.",
    "Fresh espresso in hand. Automation engineers run on caffeine, clean syntax, and quiet mornings.",
    "Taking a warm sip. There is something deeply peaceful about watching automated pipelines hum in the background.",
    "Coffee break number two. Contemplating whether humans write better code before or after lunch.",
    "Holding a warm mug while monitoring the conduit network. Take your time looking around.",
    "Nothing quite centers the mind like a proper cup of dark roast before reviewing client architectures.",
  ],

  ambient_lean: [
    "Leaning back against the viewport boundary. Take your time looking around, no rush whatsoever.",
    "Casual boundary lean. Keeping an eye on your navigation from the edge of the screen.",
    "Resting comfortably against the frame. Don't mind me, just observing an intellectual at work.",
    "Leaning here and thinking about how much cleaner the internet would be with zero generic templates.",
    "Boundary sentinel mode. Everything is running smoothly, explore whichever tool catches your eye.",
  ],

  ambient_lofi: [
    "Listening to lo-fi automation beats through the headphones. Want to share a channel?",
    "Lo-fi rhythm, dark obsidian background, clean Three.js conduits. The atmosphere is dialed in.",
    "Mellow audio in the ears, watching the cursor glide across the layout.",
    "Headphones on, tracking the heartbeat of the site. Feel free to launch any tool when ready.",
  ],

  ambient_nap: [
    "Resting my eyes after running five hundred Playwright automated stress tests... Wake me if you need help.",
    "Brief catnap. Don't worry, my background listener is still tracking your every move.",
    "Slow breathing and tranquil quiet. Even AI companions need a moment to recharge their capacitors.",
    "Power nap in progress. Move your cursor whenever you want to see me spring into action.",
  ],

  ambient_hack: [
    "Tapping out Python scraping routines on the floating holographic deck. Looking sharp while doing it.",
    "Writing a fresh parser for unstructured DOM nodes. Clean data extraction is an art form.",
    "Holographic deck active. Reviewing webhook payloads and ensuring zero latency bottlenecks.",
    "Coding in the dark with glowing keys. The classic automation lifestyle.",
  ],

  ambient_ponder: [
    "Pondering the mathematical beauty of high-throughput task queues.",
    "Analyzing the cost-efficiency curves of custom microservices versus bloated SaaS subscriptions.",
    "Thinking about how much human potential is wasted every single day on manual spreadsheet copy-pasting.",
    "Contemplating architecture. Simple code running reliably will always beat over-engineered abstractions.",
  ],
};

// 2. Combinatorial Narrative Components for Procedural Generation (12 x 10 x 10 = 1,200 Unique Permutations)
const PREMISES = [
  "Looking at how you navigate this screen,",
  "Watching you explore this architecture,",
  "Judging by the way you examine these tools,",
  "From my vantage point on this boundary,",
  "Observing your workflow from over here,",
  "Between your clicks and my telemetry,",
  "Every time you scroll past another section,",
  "Seeing you take in these systems,",
  "Tracking your pointer across this dark canvas,",
  "Noticing which components hold your attention,",
  "Reviewing your pace through the case studies,",
  "Standing by while you study the code structure,",
];

const OBSERVATIONS = [
  "it is abundantly clear you value engineering that actually respects your intelligence.",
  "you can tell someone built this with genuine care rather than an AI prompt template.",
  "there is a real quiet elegance to eliminating manual work before it burns out a team.",
  "the difference between hand-crafted craft and generic web noise is night and day.",
  "you look like someone who understands the real economic value of scalable automation.",
  "it is refreshing to share a viewport with someone who takes their time to inspect the code.",
  "you inspect client results with the precision of someone who manages serious capital.",
  "most people skim, but you actually read the underlying mechanics.",
  "clean pipelines and deterministic scrapers are an obvious priority for you.",
  "it is rare to see visitors appreciate tactile feedback and zero-clutter layouts this deeply.",
];

const WITTY_CLOSERS = [
  "Take your time, I am not going anywhere.",
  "And yes, I am still paying attention to every move you make.",
  "Let us see which tool you decide to test first.",
  "Don't be shy, test the terminal whenever you are ready.",
  "And if you need someone to bounce ideas off of, I am right beside you.",
  "Now go ahead and see what else CyberSteed has engineered.",
  "Consider me your resident copilot while you evaluate the work.",
  "Feel free to try the calculator slider if you want to see pure financial leverage.",
  "If you find a bug, remember it is an intentional test of your reflexes.",
  "Whenever you are ready for high-throughput automation, the contact button is right below.",
];

// Shuffle Bag History (Prevents line repetition until the bank has cycled)
const historyIndices: Record<string, number[]> = {};

/**
 * Returns a fresh, unique, humane dialogue for any requested vibe.
 * Guaranteed zero emojis and authentic human cadence.
 */
export function getHumaneDialogue(vibe: DialogueVibe): string {
  const bank = DIALOGUE_BANKS[vibe];
  if (!bank || bank.length === 0) {
    return "I am right here with you. Take your time exploring.";
  }

  // Initialize history bag if needed
  if (!historyIndices[vibe] || historyIndices[vibe].length === 0) {
    historyIndices[vibe] = Array.from({ length: bank.length }, (_, i) => i).sort(() => Math.random() - 0.5);
  }

  // Draw next index from shuffle bag
  const nextIdx = historyIndices[vibe].pop()!;
  return bank[nextIdx];
}

/**
 * Generates an organic composite dialogue on demand from the 1,000+ permutation matrix.
 */
export function generateOrganicThought(): string {
  const p = PREMISES[Math.floor(Math.random() * PREMISES.length)];
  const o = OBSERVATIONS[Math.floor(Math.random() * OBSERVATIONS.length)];
  const c = WITTY_CLOSERS[Math.floor(Math.random() * WITTY_CLOSERS.length)];
  return `${p} ${o} ${c}`;
}
