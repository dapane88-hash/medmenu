import { useState, useEffect } from "react";

// ── FIREBASE CONFIG ───────────────────────────────────────────────────────
const FB_CONFIG = {
  apiKey: "AIzaSyDXZlQZmpOci7r_mp_czRMHNlJsH9NHeYU",
  authDomain: "medmenu-687bd.firebaseapp.com",
  projectId: "medmenu-687bd",
  storageBucket: "medmenu-687bd.firebasestorage.app",
  messagingSenderId: "1022922743941",
  appId: "1:1022922743941:web:dbd6ed05b650f21e7649ec"
};


// ── FIREBASE SDK (caricato dinamicamente) ────────────────────────────────
let db_fs = null, auth_fb = null, googleProvider = null;

const loadFirebase = async () => {
  if (db_fs) return;
  try {
    const [{ initializeApp }, { getFirestore, doc, setDoc, getDoc }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut }] =
      await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"),
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"),
      ]);
    const app = initializeApp(FB_CONFIG);
    db_fs = { inst: getFirestore(app), doc, setDoc, getDoc };
    auth_fb = { inst: getAuth(app), signInWithPopup, signOut };
    googleProvider = new GoogleAuthProvider();
  } catch (e) { console.error("Firebase load error", e); }
};

const saveToCloud = async (uid, data) => {
  if (!db_fs) return;
  const { inst, doc, setDoc } = db_fs;
  await setDoc(doc(inst, "users", uid), data);
};

const loadFromCloud = async (uid) => {
  if (!db_fs) return null;
  const { inst, doc, getDoc } = db_fs;
  const snap = await getDoc(doc(inst, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// ── CONSTANTS ─────────────────────────────────────────────────────────────
const MEALS = [{k:"colazione",l:"Colazione",ml:"Colazione",i:"☀️",c:"#E07340"},{k:"spuntino",l:"Spuntino",ml:"Spuntino",i:"🍎",c:"#E9A820"},{k:"pranzo",l:"Primo Piatto",ml:"Pranzo",i:"🍝",c:"#2A9D8F"},{k:"cena",l:"Secondo Piatto",ml:"Cena",i:"🥩",c:"#5C7CFA"}];
const DAYS = ["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];
const DKEYS = ["lun","mar","mer","gio","ven","sab","dom"];
const ACT = [{k:"sedentary",l:"Sedentario",m:1.2},{k:"light",l:"Leggero",m:1.375},{k:"moderate",l:"Moderato",m:1.55},{k:"active",l:"Attivo",m:1.725},{k:"veryActive",l:"Molto attivo",m:1.9}];
const GOALS = [{k:"loss",l:"Dimagrimento",adj:-300},{k:"maintain",l:"Mantenimento",adj:0},{k:"gain",l:"Aumento massa",adj:300}];
const SEASONS = {all:"Tutto l'anno",spring:"Primavera",summer:"Estate",autumn:"Autunno",winter:"Inverno"};
const CATS = [{k:"verdure",l:"Verdure"},{k:"pesce",l:"Pesce/Carne"},{k:"latticini",l:"Latticini"},{k:"cereali",l:"Cereali"},{k:"legumi",l:"Legumi"},{k:"frutta",l:"Frutta"},{k:"condimenti",l:"Condimenti"},{k:"altro",l:"Altro"}];

// ── DATABASE RICETTE ──────────────────────────────────────────────────────
const DB0 = [
{id:1,name:"Pane, burro d'arachidi e marmellata",cat:"colazione",veg:true,season:"all",tags:["pane","arachidi","marmellata","dolce","veloce"],ing:[{n:"Pane integrale",a:80,u:"g",c:"cereali"},{n:"Burro d'arachidi",a:30,u:"g",c:"condimenti"},{n:"Marmellata",a:20,u:"g",c:"altro"}],proc:"Tostare il pane e spalmare burro d'arachidi e marmellata.",kcal:370,prot:12,carb:48,fat:14,t:5},
{id:2,name:"Plum cake proteico all'avena",cat:"colazione",veg:true,season:"all",tags:["plum cake","avena","yogurt greco","cioccolato","proteico"],ing:[{n:"Yogurt greco",a:250,u:"g",c:"latticini"},{n:"Farina d'avena",a:45,u:"g",c:"cereali"},{n:"Uovo",a:60,u:"g",c:"altro"},{n:"Albume",a:35,u:"g",c:"altro"},{n:"Cioccolato fondente",a:20,u:"g",c:"altro"}],proc:"Mescolare tutto, versare in stampo e cuocere a 180°C per 25-30 min.",kcal:420,prot:28,carb:40,fat:12,t:35},
{id:3,name:"Yogurt greco con crusca, miele e banana",cat:"colazione",veg:true,season:"all",tags:["yogurt greco","crusca","miele","mandorle","banana","cioccolato"],ing:[{n:"Yogurt greco",a:200,u:"g",c:"latticini"},{n:"Crusca d'avena",a:30,u:"g",c:"cereali"},{n:"Miele",a:15,u:"g",c:"condimenti"},{n:"Mandorle",a:15,u:"g",c:"frutta"},{n:"Banana",a:100,u:"g",c:"frutta"},{n:"Gocce di cioccolato",a:10,u:"g",c:"altro"}],proc:"Versare lo yogurt in una ciotola e aggiungere tutti gli ingredienti.",kcal:390,prot:22,carb:46,fat:12,t:5},
{id:4,name:"Bounty al cocco frozen",cat:"colazione",veg:true,season:"all",tags:["yogurt greco","cocco","freezer","dolce"],ing:[{n:"Yogurt greco",a:300,u:"g",c:"latticini"},{n:"Farina di cocco",a:45,u:"g",c:"altro"},{n:"Miele",a:10,u:"g",c:"condimenti"}],proc:"Mescolare yogurt, cocco e miele. Congelare 2+ ore.",kcal:320,prot:22,carb:20,fat:12,t:10},
{id:5,name:"Overnight porridge con frutti rossi",cat:"colazione",veg:true,season:"all",tags:["avena","porridge","overnight","frutti rossi","cioccolato"],ing:[{n:"Fiocchi d'avena",a:80,u:"g",c:"cereali"},{n:"Latte",a:150,u:"ml",c:"latticini"},{n:"Yogurt greco",a:100,u:"g",c:"latticini"},{n:"Frutti rossi",a:100,u:"g",c:"frutta"},{n:"Gocce di cioccolato",a:15,u:"g",c:"altro"}],proc:"Mescolare avena, latte e yogurt la sera. Riporre in frigo. Al mattino aggiungere frutti rossi e cioccolato.",kcal:430,prot:22,carb:58,fat:11,t:5},
{id:6,name:"Pancake di albumi e banana",cat:"colazione",veg:true,season:"all",tags:["pancake","albumi","banana","proteico"],ing:[{n:"Albumi",a:200,u:"g",c:"altro"},{n:"Banana matura",a:120,u:"g",c:"frutta"}],proc:"Schiacciare la banana e mescolare con gli albumi. Cuocere piccoli dischi in padella 2-3 min per lato.",kcal:200,prot:18,carb:30,fat:1,t:10},
{id:7,name:"Yogurt greco con frutti rossi",cat:"colazione",veg:true,season:"all",tags:["yogurt greco","frutti rossi","veloce"],ing:[{n:"Yogurt greco",a:200,u:"g",c:"latticini"},{n:"Frutti rossi",a:120,u:"g",c:"frutta"},{n:"Miele",a:10,u:"g",c:"condimenti"}],proc:"Versare yogurt, aggiungere frutti rossi e miele.",kcal:250,prot:18,carb:30,fat:4,t:3},
{id:10,name:"Hummus con crudité",cat:"spuntino",veg:true,season:"all",tags:["hummus","ceci","verdure","vegano"],ing:[{n:"Ceci cotti",a:150,u:"g",c:"legumi"},{n:"Tahini",a:20,u:"g",c:"condimenti"},{n:"Limone",a:15,u:"ml",c:"frutta"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"},{n:"Carote",a:80,u:"g",c:"verdure"},{n:"Sedano",a:60,u:"g",c:"verdure"}],proc:"Frullare ceci, tahini, limone e olio. Servire con crudité.",kcal:260,prot:11,carb:28,fat:12,t:10},
{id:11,name:"Yogurt con granola e frutti di bosco",cat:"spuntino",veg:true,season:"all",tags:["yogurt","granola","frutti di bosco"],ing:[{n:"Yogurt bianco",a:150,u:"g",c:"latticini"},{n:"Granola",a:30,u:"g",c:"cereali"},{n:"Frutti di bosco",a:80,u:"g",c:"frutta"},{n:"Miele",a:10,u:"g",c:"condimenti"}],proc:"Versare yogurt, aggiungere frutti di bosco, granola e miele.",kcal:270,prot:9,carb:38,fat:8,t:3},
{id:12,name:"Mix di frutta secca e mela",cat:"spuntino",veg:true,season:"all",tags:["frutta secca","noci","mandorle","mela"],ing:[{n:"Mandorle",a:20,u:"g",c:"frutta"},{n:"Noci",a:15,u:"g",c:"frutta"},{n:"Mela",a:150,u:"g",c:"frutta"}],proc:"Lavare e tagliare la mela. Servire con frutta secca.",kcal:230,prot:5,carb:26,fat:13,t:2},
{id:20,name:"Pasta al sugo con feta",cat:"pranzo",veg:true,season:"all",tags:["pasta","feta","sugo","vegetariano"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Salsa di pomodoro",a:200,u:"g",c:"verdure"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Soffriggere aglio, aggiungere salsa 10 min. Aggiungere metà feta. Condire la pasta.",kcal:460,prot:18,carb:64,fat:15,t:20},
{id:21,name:"Pasta con pesce spada e melanzane",cat:"pranzo",veg:false,season:"summer",tags:["pasta","pesce spada","melanzane","ricotta"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Pesce spada",a:150,u:"g",c:"pesce"},{n:"Melanzane",a:150,u:"g",c:"verdure"},{n:"Ricotta",a:60,u:"g",c:"latticini"},{n:"Pomodorini",a:100,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Rosolare melanzane, aggiungere pomodorini e pesce spada. Condire la pasta con ricotta.",kcal:520,prot:34,carb:60,fat:16,t:25},
{id:22,name:"Pasta e zucchine con feta",cat:"pranzo",veg:true,season:"all",tags:["pasta","zucchine","feta","vegetariano"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Zucchine",a:200,u:"g",c:"verdure"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere zucchine in olio 2 min. Coprire d'acqua, aggiungere pasta. Mantecare con feta.",kcal:450,prot:17,carb:62,fat:14,t:20},
{id:23,name:"Pasta e legumi",cat:"pranzo",veg:true,season:"all",tags:["pasta","fagioli","legumi","vegetariano"],ing:[{n:"Pasta corta",a:70,u:"g",c:"cereali"},{n:"Fagioli cannellini",a:150,u:"g",c:"legumi"},{n:"Pomodori pelati",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Soffriggere aglio. Aggiungere fagioli e pomodori. Cuocere 10 min, aggiungere pasta.",kcal:440,prot:18,carb:72,fat:9,t:30},
{id:24,name:"Gnocchi crema di zucchine e tonno",cat:"pranzo",veg:false,season:"all",tags:["gnocchi","zucchine","tonno","crema"],ing:[{n:"Gnocchi di patate",a:200,u:"g",c:"cereali"},{n:"Zucchine",a:200,u:"g",c:"verdure"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere zucchine al vapore e frullare. Condire gnocchi con crema e tonno.",kcal:420,prot:26,carb:52,fat:12,t:20},
{id:25,name:"Couscous con verdure e legumi",cat:"pranzo",veg:true,season:"all",tags:["couscous","verdure","ceci","vegano"],ing:[{n:"Couscous",a:80,u:"g",c:"cereali"},{n:"Ceci cotti",a:100,u:"g",c:"legumi"},{n:"Zucchine",a:100,u:"g",c:"verdure"},{n:"Peperoni",a:80,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Idratare il couscous con brodo. Saltare verdure e ceci. Mescolare.",kcal:390,prot:16,carb:62,fat:8,t:20},
{id:26,name:"Quinoa con verdure e feta",cat:"pranzo",veg:true,season:"all",tags:["quinoa","verdure","feta","vegetariano"],ing:[{n:"Quinoa",a:80,u:"g",c:"cereali"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere quinoa. Saltare verdure. Mescolare con feta.",kcal:430,prot:16,carb:56,fat:16,t:20},
{id:27,name:"Poke di riso con tonno",cat:"pranzo",veg:false,season:"summer",tags:["poke","riso","tonno","fresco","estate"],ing:[{n:"Riso basmati",a:80,u:"g",c:"cereali"},{n:"Tonno fresco",a:150,u:"g",c:"pesce"},{n:"Avocado",a:80,u:"g",c:"verdure"},{n:"Cetriolo",a:80,u:"g",c:"verdure"},{n:"Salsa di soia",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere il riso. Tagliare tonno a cubetti, marinare con soia. Assemblare la bowl.",kcal:490,prot:32,carb:54,fat:16,t:25},
{id:28,name:"Orecchiette cime di rapa e fagioli",cat:"pranzo",veg:true,season:"autumn",tags:["orecchiette","cime di rapa","fagioli","vegetariano"],ing:[{n:"Orecchiette",a:80,u:"g",c:"cereali"},{n:"Cime di rapa",a:200,u:"g",c:"verdure"},{n:"Fagioli borlotti",a:120,u:"g",c:"legumi"},{n:"Olio EVO",a:20,u:"ml",c:"condimenti"}],proc:"Cuocere cime di rapa e pasta nella stessa acqua. Saltare con aglio e fagioli.",kcal:450,prot:18,carb:70,fat:11,t:30},
{id:29,name:"Riso venere con gamberi e zucchine",cat:"pranzo",veg:false,season:"all",tags:["riso venere","gamberi","zucchine"],ing:[{n:"Riso venere",a:80,u:"g",c:"cereali"},{n:"Gamberi",a:200,u:"g",c:"pesce"},{n:"Zucchine",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere riso venere 40 min. Saltare gamberi e zucchine. Mescolare.",kcal:460,prot:30,carb:58,fat:12,t:45},
{id:30,name:"Pasta e broccoli con ceci",cat:"pranzo",veg:true,season:"winter",tags:["pasta","broccoli","ceci","vegetariano"],ing:[{n:"Pasta integrale",a:80,u:"g",c:"cereali"},{n:"Broccoli",a:200,u:"g",c:"verdure"},{n:"Ceci cotti",a:120,u:"g",c:"legumi"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Lessare broccoli, frullarne metà. Soffriggere aglio con ceci. Condire la pasta.",kcal:440,prot:19,carb:68,fat:10,t:25},
{id:40,name:"Spiedini di salmone con patate",cat:"cena",veg:false,season:"all",tags:["salmone","spiedini","limone","patate"],ing:[{n:"Salmone",a:200,u:"g",c:"pesce"},{n:"Patate",a:200,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"},{n:"Limone",a:30,u:"ml",c:"frutta"}],proc:"Marinare salmone con olio e limone 1 ora. Cuocere al forno con patate 25-30 min.",kcal:480,prot:36,carb:30,fat:22,t:40},
{id:41,name:"Piadina con zucchine e ricotta",cat:"cena",veg:true,season:"all",tags:["piadina","zucchine","ricotta","vegetariano"],ing:[{n:"Piadina integrale",a:100,u:"g",c:"cereali"},{n:"Ricotta",a:100,u:"g",c:"latticini"},{n:"Zucchine",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Grigliare le zucchine. Spalmare ricotta sulla piadina e aggiungere zucchine.",kcal:400,prot:18,carb:46,fat:15,t:15},
{id:42,name:"Spiedini di pollo alle spezie",cat:"cena",veg:false,season:"all",tags:["pollo","spiedini","spezie","patate","forno"],ing:[{n:"Petto di pollo",a:200,u:"g",c:"pesce"},{n:"Patate",a:200,u:"g",c:"verdure"},{n:"Paprika",a:3,u:"g",c:"condimenti"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Marinare pollo con spezie. Cuocere in forno a 200°C con patate per 25-30 min.",kcal:400,prot:38,carb:28,fat:12,t:35},
{id:43,name:"Burger di broccoli e feta",cat:"cena",veg:true,season:"all",tags:["broccoli","feta","burger","vegetariano"],ing:[{n:"Broccoli",a:300,u:"g",c:"verdure"},{n:"Feta",a:60,u:"g",c:"latticini"},{n:"Uovo",a:60,u:"g",c:"altro"},{n:"Farina",a:15,u:"g",c:"cereali"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Bollire e strizzare i broccoli. Mescolare con feta, uovo e farina. Formare burger e cuocere 2-3 min per lato.",kcal:310,prot:20,carb:18,fat:16,t:25},
{id:44,name:"Uova alla passata di pomodoro",cat:"cena",veg:true,season:"all",tags:["uova","pomodoro","vegetariano","veloce"],ing:[{n:"Uova",a:180,u:"g",c:"altro"},{n:"Passata di pomodoro",a:250,u:"g",c:"verdure"},{n:"Aglio",a:5,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Soffriggere aglio, aggiungere passata 10 min. Aprire le uova nel sugo, coprire e cuocere 5-6 min.",kcal:320,prot:22,carb:12,fat:20,t:20},
{id:45,name:"Bocconcini di pollo al forno",cat:"cena",veg:false,season:"all",tags:["pollo","peperoni","forno","verdure","patate"],ing:[{n:"Petto di pollo",a:200,u:"g",c:"pesce"},{n:"Peperoni misti",a:200,u:"g",c:"verdure"},{n:"Patate",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Tagliare tutto a bocconcini, condire con olio e origano. Cuocere in forno a 200°C per 30-35 min.",kcal:380,prot:36,carb:26,fat:14,t:40},
{id:46,name:"Insalata di melone, feta e cetrioli",cat:"cena",veg:true,season:"summer",tags:["melone","feta","cetriolo","estate","veloce"],ing:[{n:"Melone",a:200,u:"g",c:"frutta"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Cetriolo",a:150,u:"g",c:"verdure"},{n:"Cipolla rossa",a:40,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Tagliare melone e cetriolo. Aggiungere feta sbriciolata e cipolla. Condire.",kcal:280,prot:10,carb:26,fat:14,t:10},
{id:47,name:"Parmigiana light al forno",cat:"cena",veg:true,season:"summer",tags:["parmigiana","melanzane","mozzarella","forno","vegetariano"],ing:[{n:"Melanzane",a:400,u:"g",c:"verdure"},{n:"Passata di pomodoro",a:200,u:"g",c:"verdure"},{n:"Mozzarella light",a:100,u:"g",c:"latticini"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Grigliare le melanzane. Alternare strati con passata e mozzarella. Infornare a 180°C per 25-30 min.",kcal:320,prot:18,carb:16,fat:18,t:50},
{id:48,name:"Sformato di zucchine e ricotta",cat:"cena",veg:true,season:"all",tags:["sformato","zucchine","ricotta","vegetariano","light"],ing:[{n:"Zucchine",a:400,u:"g",c:"verdure"},{n:"Ricotta",a:200,u:"g",c:"latticini"},{n:"Uova",a:60,u:"g",c:"altro"},{n:"Parmigiano",a:30,u:"g",c:"latticini"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Grigliare zucchine a fette. Alternare strati con ricotta e parmigiano. Infornare a 180°C per 20 min.",kcal:280,prot:16,carb:12,fat:18,t:30},
{id:49,name:"Insalata di ceci e verdure",cat:"cena",veg:true,season:"all",tags:["ceci","pomodori","cetriolo","vegano"],ing:[{n:"Ceci cotti",a:200,u:"g",c:"legumi"},{n:"Pomodori",a:150,u:"g",c:"verdure"},{n:"Cetriolo",a:100,u:"g",c:"verdure"},{n:"Peperoni",a:80,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Tagliare tutte le verdure. Mescolare con ceci, condire con limone e olio.",kcal:330,prot:14,carb:42,fat:11,t:10},
];

// ── UTILS ─────────────────────────────────────────────────────────────────
const getWkKey = d => {
  const dt = new Date(d||Date.now());
  dt.setHours(0,0,0,0);
  dt.setDate(dt.getDate()+3-(dt.getDay()+6)%7);
  const w1 = new Date(dt.getFullYear(),0,4);
  const wn = 1+Math.round(((dt-w1)/864e5-3+(w1.getDay()+6)%7)/7);
  return `${dt.getFullYear()}-W${String(wn).padStart(2,'0')}`;
};
const wkMon = wk => {
  const [y,w] = wk.split('-W').map(Number);
  const j = new Date(y,0,4);
  const m = new Date(j);
  m.setDate(j.getDate()-(j.getDay()+6)%7+(w-1)*7);
  return m;
};
const wkLabel = wk => {
  const m = wkMon(wk);
  const s = new Date(m);
  s.setDate(m.getDate()+6);
  return `${m.getDate()}/${m.getMonth()+1} - ${s.getDate()}/${s.getMonth()+1}/${s.getFullYear()}`;
};
const shiftWk = (wk,d) => getWkKey(new Date(wkMon(wk).getTime()+d*7*864e5));
const calcTDEE = p => {
  const b = 10*p.weight+6.25*p.height-5*p.age+(p.sex==="M"?5:-161);
  return Math.round(b*(ACT.find(a=>a.k===p.activity)?.m||1.55))+(GOALS.find(g=>g.k===p.goal)?.adj||0);
};
const calcTgt = p => {
  const c = calcTDEE(p);
  return {kcal:c,prot:Math.round(c*.20/4),carb:Math.round(c*.50/4),fat:Math.round(c*.30/9)};
};
const initWkMenu = () => {
  const m = {};
  DKEYS.forEach(d=>{m[d]={};MEALS.forEach(mt=>{m[d][mt.k]=null;});});
  return m;
};
const getShop = (wm,db) => {
  const items = {};
  DKEYS.forEach(d=>MEALS.forEach(mt=>{
    const e = wm?.[d]?.[mt.k];
    if(!e?.rid) return;
    const r = db.find(x=>x.id===e.rid);
    if(!r) return;
    const p = e.shopP||1;
    r.ing.forEach(ing=>{
      const k = ing.n.toLowerCase();
      if(ing.u==="q.b."){if(!items[k])items[k]={name:ing.n,amount:0,unit:"q.b.",cat:ing.c||"altro"};}
      else{if(items[k])items[k].amount+=ing.a*p;else items[k]={name:ing.n,amount:ing.a*p,unit:ing.u,cat:ing.c||"altro"};}
    });
  }));
  return Object.values(items).sort((a,b)=>a.name.localeCompare(b.name));
};
const dayMacros = (wm,db,day) => {
  let t = {kcal:0,prot:0,carb:0,fat:0};
  MEALS.forEach(mt=>{
    const e = wm?.[day]?.[mt.k];
    if(!e) return;
    if(e.rid){const r=db.find(x=>x.id===e.rid);if(!r)return;t.kcal+=r.kcal;t.prot+=r.prot;t.carb+=r.carb;t.fat+=r.fat;}
    else if(e.fid){t.kcal+=e.kcal||0;t.prot+=e.prot||0;t.carb+=e.carb||0;t.fat+=e.fat||0;}
  });
  return t;
};
const srch = (db,q,cat,veg) => {
  let r = db;
  if(cat&&cat!=="all") r=r.filter(x=>x.cat===cat);
  if(veg) r=r.filter(x=>x.veg===true);
  if(!q.trim()) return r;
  const lq = q.toLowerCase();
  return r.filter(x=>x.name.toLowerCase().includes(lq)||x.tags.some(t=>t.includes(lq))||x.ing.some(i=>i.n.toLowerCase().includes(lq)));
};
const shareWA = t => window.open("https://wa.me/?text="+encodeURIComponent(t),"_blank");
const menuTxt = (wm,db,wk) => {
  let t = "Menu Settimana "+wkLabel(wk)+"\n\n";
  DKEYS.forEach((d,i)=>{
    t+=DAYS[i]+"\n";
    MEALS.forEach(mt=>{const e=wm?.[d]?.[mt.k];if(!e?.rid)return;const r=db.find(x=>x.id===e.rid);if(!r)return;t+="  "+mt.ml+": "+r.name+" ("+r.kcal+"kcal)\n";});
    t+="\n";
  });
  return t;
};
const shopTxt = (wm,db) => {
  const it = getShop(wm,db);
  let t = "Lista della Spesa MedMenu\n\n";
  CATS.forEach(c=>{
    const g=it.filter(i=>i.cat===c.k);
    if(!g.length) return;
    t+=c.l+"\n";
    g.forEach(i=>{t+="[ ] "+i.name+": "+(i.unit==="q.b."?"q.b.":Math.round(i.amount)+i.unit)+"\n";});
    t+="\n";
  });
  return t;
};

// ── OPEN FOOD FACTS ───────────────────────────────────────────────────────
const searchFood = async q => {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=6&fields=product_name,nutriments,serving_size`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.products||[])
    .filter(p=>p.product_name&&p.nutriments)
    .map((p,i)=>({
      id:"off_"+i,
      name:p.product_name,
      kcal:Math.round(p.nutriments["energy-kcal_100g"]||0),
      prot:Math.round(p.nutriments["proteins_100g"]||0),
      carb:Math.round(p.nutriments["carbohydrates_100g"]||0),
      fat:Math.round(p.nutriments["fat_100g"]||0),
    }))
    .filter(p=>p.kcal>0);
};

// ── CSS ───────────────────────────────────────────────────────────────────
const CSS = `*{box-sizing:border-box;margin:0;padding:0;}body{background:#FFF8F0;font-family:system-ui,sans-serif;}.app{max-width:430px;margin:0 auto;min-height:100vh;background:#FFF8F0;}.hdr{background:linear-gradient(135deg,#E07340,#F4A261);padding:52px 20px 20px;color:#fff;}.hdr h1{font-size:22px;font-weight:800;}.hdr p{font-size:12px;opacity:.85;margin-top:2px;}.tbar{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#fff;border-top:1px solid #EEE5DB;display:flex;z-index:100;box-shadow:0 -3px 16px rgba(0,0,0,.09);}.tab{flex:1;padding:10px 2px 8px;border:none;background:none;cursor:pointer;font-size:9px;font-weight:600;color:#999;display:flex;flex-direction:column;align-items:center;gap:2px;}.tab.on{color:#E07340;}.tab .ic{font-size:19px;}.cnt{padding:0 0 84px;}.cd{background:#fff;border-radius:16px;padding:16px;margin:0 12px 10px;box-shadow:0 2px 10px rgba(0,0,0,.07);}.btn{border:none;border-radius:12px;cursor:pointer;font-weight:700;font-family:inherit;}.bp{background:#E07340;color:#fff;padding:13px 20px;font-size:15px;width:100%;}.bp:disabled{opacity:.4;}.bs{background:#FFF0E8;color:#E07340;padding:6px 10px;font-size:12px;border-radius:8px;}.bg{background:#E8F4F0;color:#2A9D8F;padding:6px 10px;font-size:12px;border-radius:8px;}.inp{width:100%;padding:12px 14px;border-radius:12px;border:2px solid #E8E0D8;font-size:14px;background:#fff;outline:none;font-family:inherit;}.inp:focus{border-color:#E07340;}.lbl{font-weight:700;color:#264653;margin-bottom:6px;display:block;font-size:13px;}.ov{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;overflow-y:auto;}.mod{background:#fff;border-radius:22px 22px 0 0;margin-top:60px;min-height:calc(100vh - 60px);padding:20px;}.mhd{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}.xb{width:34px;height:34px;border-radius:17px;background:#F5F0E8;border:none;cursor:pointer;font-size:18px;}.pb{height:8px;border-radius:4px;background:#F0E8DF;overflow:hidden;}.pf{height:100%;border-radius:4px;}`;

// ── LOGIN SCREEN ──────────────────────────────────────────────────────────
function LoginScreen({onLogin}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("main"); // main | login | register
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");

  const handleGoogle = async () => {
    setLoading(true); setErr("");
    try {
      await loadFirebase();
      const result = await auth_fb.signInWithPopup(auth_fb.inst, googleProvider);
      onLogin(result.user);
    } catch(e) { setErr("Accesso Google fallito. Riprova."); }
    setLoading(false);
  };



  const handleEmailLogin = async () => {
    if(!email||!pass){setErr("Inserisci email e password.");return;}
    setLoading(true); setErr("");
    try {
      await loadFirebase();
      const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
      const result = await signInWithEmailAndPassword(auth_fb.inst, email, pass);
      onLogin(result.user);
    } catch(e) {
      if(e.code==="auth/user-not-found"||e.code==="auth/wrong-password") setErr("Email o password errati.");
      else setErr("Errore di accesso. Riprova.");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if(!email||!pass||!name){setErr("Compila tutti i campi.");return;}
    if(pass.length<6){setErr("La password deve avere almeno 6 caratteri.");return;}
    setLoading(true); setErr("");
    try {
      await loadFirebase();
      const { createUserWithEmailAndPassword, updateProfile } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
      const result = await createUserWithEmailAndPassword(auth_fb.inst, email, pass);
      await updateProfile(result.user, {displayName: name});
      onLogin(result.user);
    } catch(e) {
      if(e.code==="auth/email-already-in-use") setErr("Email già registrata. Prova ad accedere.");
      else setErr("Errore di registrazione. Riprova.");
    }
    setLoading(false);
  };

  const btnStyle = (bg,color,border) => ({background:bg,border:"2px solid "+(border||bg),borderRadius:14,padding:"14px 24px",fontSize:14,fontWeight:700,color,display:"flex",alignItems:"center",gap:12,width:"100%",justifyContent:"center",cursor:"pointer",fontFamily:"inherit"});

  return (
    <div className="app"><style>{CSS}</style>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"32px 24px",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:12}}>🫒</div>
        <h1 style={{fontSize:26,fontWeight:800,color:"#264653",marginBottom:6}}>MedMenu</h1>
        <p style={{color:"#888",fontSize:14,marginBottom:32,lineHeight:1.6}}>Il tuo pianificatore di menu mediterraneo.<br/>Dati salvati nel cloud, sempre disponibili.</p>

        {mode==="main"&&<div style={{width:"100%",maxWidth:320,display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={handleGoogle} disabled={loading} style={btnStyle("#fff","#264653","#E8E0D8")}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="22" height="22" alt=""/>
            Accedi con Google
          </button>
          <div style={{display:"flex",alignItems:"center",gap:10,margin:"4px 0"}}>
            <div style={{flex:1,height:1,background:"#EEE"}}/>
            <span style={{color:"#CCC",fontSize:12}}>oppure</span>
            <div style={{flex:1,height:1,background:"#EEE"}}/>
          </div>
          <button onClick={()=>setMode("login")} style={btnStyle("#E07340","#fff","#E07340")}>Accedi con Email</button>
          <button onClick={()=>setMode("register")} style={btnStyle("#fff","#E07340","#E07340")}>Registrati</button>
        </div>}

        {(mode==="login"||mode==="register")&&<div style={{width:"100%",maxWidth:320}}>
          <div style={{fontWeight:700,color:"#264653",fontSize:16,marginBottom:16}}>
            {mode==="login"?"Accedi con Email":"Crea un account"}
          </div>
          {mode==="register"&&<div style={{marginBottom:10,textAlign:"left"}}>
            <label className="lbl">Nome</label>
            <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Il tuo nome"/>
          </div>}
          <div style={{marginBottom:10,textAlign:"left"}}>
            <label className="lbl">Email</label>
            <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nome@email.com"/>
          </div>
          <div style={{marginBottom:16,textAlign:"left"}}>
            <label className="lbl">Password {mode==="register"&&<span style={{fontWeight:400,color:"#888"}}>(min. 6 caratteri)</span>}</label>
            <input className="inp" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/>
          </div>
          {err&&<p style={{color:"#e55",marginBottom:10,fontSize:13}}>{err}</p>}
          <button onClick={mode==="login"?handleEmailLogin:handleRegister} disabled={loading} style={{...btnStyle("#E07340","#fff","#E07340"),marginBottom:10,opacity:loading?.6:1}}>
            {loading?"...":(mode==="login"?"Accedi":"Registrati")}
          </button>
          <button onClick={()=>{setMode("main");setErr("");}} style={btnStyle("#fff","#888","#EEE")}>Indietro</button>
        </div>}

        {mode==="main"&&err&&<p style={{color:"#e55",marginTop:12,fontSize:13}}>{err}</p>}
        <p style={{color:"#CCC",fontSize:11,marginTop:24}}>I tuoi dati sono privati e salvati in modo sicuro.</p>
      </div>
    </div>
  );
}

// ── SETUP ─────────────────────────────────────────────────────────────────
function Setup({user, onDone}) {
  const [s, setS] = useState(0);
  const [f, setF] = useState({name:user.displayName||"",sex:"M",age:"",height:"",weight:"",activity:"moderate",goal:"maintain"});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const ok = [f.name.trim(), Number(f.age)>0&&Number(f.height)>0&&Number(f.weight)>0, true];
  return (
    <div className="app"><style>{CSS}</style>
      <div style={{background:"linear-gradient(135deg,#E07340,#F4A261)",padding:"36px 24px 24px",color:"#fff",textAlign:"center"}}>
        <div style={{fontSize:48}}>🫒</div>
        <h1 style={{fontSize:24,fontWeight:800,margin:"8px 0 4px"}}>MedMenu</h1>
        <p style={{opacity:.9,fontSize:13}}>Ciao {user.displayName?.split(" ")[0]}! Completiamo il tuo profilo.</p>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:14}}>
          {[0,1,2].map(i=><div key={i} style={{height:6,borderRadius:3,background:i<=s?"#fff":"rgba(255,255,255,.35)",width:i===s?28:8,transition:"all .3s"}}/>)}
        </div>
      </div>
      <div style={{padding:"20px"}}>
        {s===0&&<>
          <h2 style={{color:"#264653",marginBottom:14}}>Dati personali</h2>
          <div style={{marginBottom:12}}><label className="lbl">Nome</label><input className="inp" value={f.name} onChange={e=>set("name",e.target.value)}/></div>
          <label className="lbl">Sesso biologico</label>
          <div style={{display:"flex",gap:10}}>
            {[{v:"M",l:"Maschio"},{v:"F",l:"Femmina"}].map(x=><button key={x.v} onClick={()=>set("sex",x.v)} className="btn" style={{flex:1,padding:"12px",fontSize:14,background:f.sex===x.v?"#E07340":"#fff",color:f.sex===x.v?"#fff":"#264653",border:"2px solid "+(f.sex===x.v?"#E07340":"#E8E0D8"),borderRadius:12}}>{x.l}</button>)}
          </div>
        </>}
        {s===1&&<>
          <h2 style={{color:"#264653",marginBottom:14}}>Dati fisici</h2>
          {[{k:"age",l:"Eta",u:"anni"},{k:"height",l:"Altezza",u:"cm"},{k:"weight",l:"Peso",u:"kg"}].map(fd=>(
            <div key={fd.k} style={{marginBottom:12}}><label className="lbl">{fd.l} ({fd.u})</label><input className="inp" type="number" value={f[fd.k]} onChange={e=>set(fd.k,e.target.value)}/></div>
          ))}
          <label className="lbl">Attivita fisica</label>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {ACT.map(a=><button key={a.k} onClick={()=>set("activity",a.k)} className="btn" style={{padding:"10px 14px",textAlign:"left",background:f.activity===a.k?"#E07340":"#fff",color:f.activity===a.k?"#fff":"#264653",border:"2px solid "+(f.activity===a.k?"#E07340":"#E8E0D8"),borderRadius:12,fontSize:13}}>{a.l}</button>)}
          </div>
        </>}
        {s===2&&<>
          <h2 style={{color:"#264653",marginBottom:14}}>Obiettivo</h2>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {GOALS.map(g=><button key={g.k} onClick={()=>set("goal",g.k)} className="btn" style={{padding:"14px 16px",textAlign:"left",background:f.goal===g.k?"#E07340":"#fff",color:f.goal===g.k?"#fff":"#264653",border:"2px solid "+(f.goal===g.k?"#E07340":"#E8E0D8"),borderRadius:12,fontSize:14}}>{g.l}</button>)}
          </div>
        </>}
      </div>
      <div style={{padding:"0 20px 28px",display:"flex",gap:10}}>
        {s>0&&<button onClick={()=>setS(x=>x-1)} className="btn" style={{flex:1,padding:"13px",border:"2px solid #E07340",color:"#E07340",background:"transparent"}}>Indietro</button>}
        <button onClick={()=>s<2?ok[s]&&setS(x=>x+1):onDone({...f,age:Number(f.age),height:Number(f.height),weight:Number(f.weight)})} disabled={!ok[s]} className="btn bp" style={{flex:2}}>{s<2?"Avanti":"Inizia!"}</button>
      </div>
    </div>
  );
}

// ── RECIPE CARD ───────────────────────────────────────────────────────────
function RCard({r, onSel}) {
  const mc = MEALS.find(m=>m.k===r.cat)?.c||"#888";
  const ml = MEALS.find(m=>m.k===r.cat)?.l||r.cat;
  const mi = MEALS.find(m=>m.k===r.cat)?.i||"🍴";
  return (
    <div onClick={()=>onSel(r)} className="cd" style={{cursor:"pointer",border:"1px solid #F0E8DF"}}>
      <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <div style={{width:44,height:44,borderRadius:12,background:mc+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{mi}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,color:"#264653",fontSize:13,lineHeight:1.3,marginBottom:4}}>{r.name}</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <span style={{background:mc+"22",color:mc,padding:"3px 8px",borderRadius:20,fontSize:11,fontWeight:700}}>{ml}</span>
            <span style={{background:"#F5F0E8",color:"#888",padding:"3px 8px",borderRadius:20,fontSize:11}}>{r.t}min</span>
            {r.veg&&<span style={{background:"#E8F4E8",color:"#2D8A2D",padding:"3px 8px",borderRadius:20,fontSize:11}}>veg</span>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",borderTop:"1px solid #F5F0E8",paddingTop:8,marginTop:8}}>
        {[{l:"kcal",v:r.kcal,c:"#E07340"},{l:"prot",v:r.prot+"g",c:"#2A9D8F"},{l:"carb",v:r.carb+"g",c:"#E9A820"},{l:"grassi",v:r.fat+"g",c:"#9C6B9E"}].map(m=>(
          <div key={m.l} style={{flex:1,textAlign:"center"}}><div style={{fontWeight:800,color:m.c,fontSize:12}}>{m.v}</div><div style={{fontSize:10,color:"#999"}}>{m.l}</div></div>
        ))}
      </div>
    </div>
  );
}

// ── RECIPE MODAL ──────────────────────────────────────────────────────────
function RModal({recipe, onClose, onAdd, ratings, onRate}) {
  const mc = MEALS.find(m=>m.k===recipe.cat)?.c||"#888";
  const ml = MEALS.find(m=>m.k===recipe.cat)?.ml||recipe.cat;
  const [adding, setAdding] = useState(false);
  const [selD, setSelD] = useState(DKEYS[0]);
  const [selM, setSelM] = useState(recipe.cat);
  const [shopP, setShopP] = useState(1);
  const rating = ratings?.[recipe.id]||0;
  return (
    <div className="ov" onClick={onClose}>
      <div className="mod" onClick={e=>e.stopPropagation()}>
        <div className="mhd">
          <span style={{background:mc+"22",color:mc,padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:700}}>{ml}</span>
          <button className="xb" onClick={onClose}>x</button>
        </div>
        <h2 style={{color:"#264653",fontSize:17,lineHeight:1.3,marginBottom:8}}>{recipe.name}</h2>
        <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
          <span style={{background:"#F5F0E8",color:"#888",padding:"3px 8px",borderRadius:12,fontSize:11}}>{recipe.t} min</span>
          <span style={{background:"#F5F0E8",color:"#888",padding:"3px 8px",borderRadius:12,fontSize:11}}>{SEASONS[recipe.season]||recipe.season}</span>
          {recipe.veg&&<span style={{background:"#E8F4E8",color:"#2D8A2D",padding:"3px 8px",borderRadius:12,fontSize:11}}>Vegetariano</span>}
        </div>
        <div style={{display:"flex",gap:2,marginBottom:12,alignItems:"center"}}>
          <span style={{fontSize:12,color:"#666",marginRight:4}}>Voto:</span>
          {[1,2,3,4,5].map(s=><span key={s} onClick={()=>onRate(recipe.id,s)} style={{fontSize:20,cursor:"pointer",opacity:s<=rating?1:.25}}>{s<=rating?"★":"☆"}</span>)}
        </div>
        <div style={{background:"#FFF8F0",borderRadius:12,padding:12,marginBottom:12}}>
          <div style={{fontWeight:700,color:"#264653",marginBottom:8,fontSize:12}}>Macro — 1 porzione</div>
          <div style={{display:"flex",gap:6}}>
            {[{l:"Calorie",v:recipe.kcal+"kcal",c:"#E07340"},{l:"Proteine",v:recipe.prot+"g",c:"#2A9D8F"},{l:"Carboidrati",v:recipe.carb+"g",c:"#E9A820"},{l:"Grassi",v:recipe.fat+"g",c:"#9C6B9E"}].map(m=>(
              <div key={m.l} style={{flex:1,background:m.c+"11",borderRadius:10,padding:"8px 2px",textAlign:"center"}}>
                <div style={{fontWeight:800,color:m.c,fontSize:13}}>{m.v}</div>
                <div style={{fontSize:10,color:"#888",marginTop:2}}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontWeight:700,color:"#264653",fontSize:12,marginBottom:8}}>Ingredienti</div>
          {recipe.ing.map((ing,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F5F0E8"}}>
              <span style={{color:"#264653",fontSize:13}}>{ing.n}</span>
              <span style={{color:"#888",fontWeight:600,fontSize:13}}>{ing.u==="q.b."?"q.b.":ing.a+ing.u}</span>
            </div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontWeight:700,color:"#264653",marginBottom:6,fontSize:12}}>Preparazione</div>
          <p style={{color:"#555",fontSize:13,lineHeight:1.7}}>{recipe.proc}</p>
        </div>
        {!adding?<button className="btn bp" onClick={()=>setAdding(true)}>+ Aggiungi al menu</button>:
          <div style={{background:"#FFF8F0",borderRadius:12,padding:14}}>
            <div style={{fontWeight:700,color:"#264653",marginBottom:10,fontSize:13}}>Aggiungi al menu</div>
            <div style={{display:"flex",gap:10,marginBottom:10}}>
              <div style={{flex:1}}><label className="lbl" style={{fontSize:12}}>Giorno</label>
                <select className="inp" style={{fontSize:13}} value={selD} onChange={e=>setSelD(e.target.value)}>
                  {DKEYS.map((d,i)=><option key={d} value={d}>{DAYS[i]}</option>)}
                </select>
              </div>
              <div style={{flex:1}}><label className="lbl" style={{fontSize:12}}>Pasto</label>
                <select className="inp" style={{fontSize:13}} value={selM} onChange={e=>setSelM(e.target.value)}>
                  {MEALS.map(m=><option key={m.k} value={m.k}>{m.ml}</option>)}
                </select>
              </div>
            </div>
            <label className="lbl" style={{fontSize:12}}>Persone (per spesa)</label>
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              {[1,2,3,4,5,6].map(n=><button key={n} onClick={()=>setShopP(n)} className="btn" style={{flex:1,height:36,background:shopP===n?"#E07340":"#fff",color:shopP===n?"#fff":"#264653",border:"2px solid "+(shopP===n?"#E07340":"#E8E0D8"),borderRadius:10,fontSize:13}}>{n}</button>)}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setAdding(false)} className="btn" style={{flex:1,padding:"11px",border:"2px solid #E8E0D8",color:"#888",background:"#fff",fontSize:13}}>Annulla</button>
              <button onClick={()=>{onAdd(selD,selM,recipe.id,shopP);setAdding(false);onClose();}} className="btn bp" style={{flex:2}}>Aggiungi</button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

// ── FOOD MODAL (Open Food Facts) ──────────────────────────────────────────
function FoodModal({mealLabel, onClose, onAdd}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [sel, setSel] = useState(null);
  const [amt, setAmt] = useState(100);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const timer = useState(null);
  const calc = f => ({kcal:Math.round(f.kcal*amt/100),prot:Math.round(f.prot*amt/100),carb:Math.round(f.carb*amt/100),fat:Math.round(f.fat*amt/100)});
  const macros = sel ? calc(sel) : null;
  const search = async query => {
    if(!query.trim()){setResults([]);setSel(null);return;}
    setLoading(true);setErr("");setSel(null);
    try {
      const data = await searchFood(query);
      if(data.length===0) setErr("Nessun risultato. Prova con un termine diverso.");
      setResults(data);
    } catch(e) {setErr("Errore di rete. Controlla la connessione.");}
    setLoading(false);
  };
  const onType = e => {
    const v = e.target.value; setQ(v);
    if(timer[0]) clearTimeout(timer[0]);
    timer[0] = setTimeout(()=>search(v), 700);
  };
  return (
    <div className="ov" onClick={onClose}>
      <div className="mod" onClick={e=>e.stopPropagation()}>
        <div className="mhd"><h3 style={{color:"#264653"}}>Alimento — {mealLabel}</h3><button className="xb" onClick={onClose}>x</button></div>
        <div style={{fontSize:12,color:"#888",marginBottom:8}}>Dati da Open Food Facts — milioni di alimenti</div>
        <input className="inp" value={q} onChange={onType} placeholder="es. bresaola, ricotta, avena..."/>
        <div style={{minHeight:80,margin:"10px 0",borderRadius:12,border:"1px solid #F0E8DF",overflow:"hidden"}}>
          {loading&&<div style={{padding:"18px",textAlign:"center",color:"#E07340",fontSize:13}}>Ricerca in corso...</div>}
          {!loading&&err&&<div style={{padding:"14px",textAlign:"center",color:"#e55",fontSize:13}}>{err}</div>}
          {!loading&&!q&&<div style={{padding:"14px",textAlign:"center",color:"#CCC",fontSize:13}}>Digita per cercare qualsiasi alimento</div>}
          {!loading&&!err&&q&&results.length===0&&!loading&&<div style={{padding:"14px",textAlign:"center",color:"#CCC",fontSize:13}}>Nessun risultato</div>}
          {!loading&&results.map(f=>(
            <div key={f.id} onClick={()=>setSel(f)} style={{padding:"10px 14px",borderBottom:"1px solid #F5F0E8",cursor:"pointer",background:sel&&sel.id===f.id?"#FFF0E8":"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:sel&&sel.id===f.id?700:400,color:"#264653",fontSize:13,flex:1,marginRight:8}}>{f.name}</span>
              <span style={{fontSize:11,color:"#888",flexShrink:0}}>{f.kcal}kcal/100g</span>
            </div>
          ))}
        </div>
        {sel&&macros&&<>
          <label className="lbl" style={{fontSize:12}}>Quantita (g)</label>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <button onClick={()=>setAmt(a=>Math.max(10,a-10))} className="btn" style={{width:36,height:36,borderRadius:18,background:"#F5F0E8",color:"#264653",fontSize:18,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
            <input type="number" value={amt} onChange={e=>setAmt(Math.max(10,Number(e.target.value)||10))} style={{flex:1,textAlign:"center",padding:"8px",borderRadius:10,border:"2px solid #E07340",fontSize:16,fontWeight:700,outline:"none"}}/>
            <button onClick={()=>setAmt(a=>a+10)} className="btn" style={{width:36,height:36,borderRadius:18,background:"#E07340",color:"#fff",fontSize:18,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            <span style={{color:"#888",fontSize:13}}>g</span>
          </div>
          <div style={{background:"#FFF8F0",borderRadius:12,padding:12,marginBottom:14}}>
            <div style={{fontWeight:700,color:"#264653",marginBottom:8,fontSize:12}}>Macro per {amt}g di {sel.name}</div>
            <div style={{display:"flex",gap:6}}>
              {[{l:"Calorie",v:macros.kcal+"kcal",c:"#E07340"},{l:"Proteine",v:macros.prot+"g",c:"#2A9D8F"},{l:"Carb",v:macros.carb+"g",c:"#E9A820"},{l:"Grassi",v:macros.fat+"g",c:"#9C6B9E"}].map(m=>(
                <div key={m.l} style={{flex:1,background:m.c+"11",borderRadius:10,padding:"6px 2px",textAlign:"center"}}>
                  <div style={{fontWeight:800,color:m.c,fontSize:12}}>{m.v}</div>
                  <div style={{fontSize:10,color:"#888",marginTop:1}}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn bp" onClick={()=>{onAdd({fid:sel.id,name:sel.name+" ("+amt+"g)",amount:amt,...macros});onClose();}}>+ Aggiungi</button>
        </>}
      </div>
    </div>
  );
}

// ── SEARCH TAB ────────────────────────────────────────────────────────────
function SearchTab({db, onAddToMenu, ratings, onRate}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [veg, setVeg] = useState(false);
  const [season, setSeason] = useState("all");
  const [sel, setSel] = useState(null);
  const res = srch(db,q,cat,veg).filter(r=>season==="all"||r.season===season||r.season==="all");
  return (
    <div>
      {sel&&<RModal recipe={sel} onClose={()=>setSel(null)} onAdd={onAddToMenu} ratings={ratings} onRate={onRate}/>}
      <div className="hdr"><h1>Ricette</h1><p>{db.length} ricette mediterranee</p></div>
      <div style={{padding:"10px 12px 0"}}>
        <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca per nome, ingrediente..."/>
        <div style={{background:"#fff",borderRadius:14,padding:"10px 12px",marginTop:8,boxShadow:"0 1px 6px rgba(0,0,0,.06)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#aaa",marginBottom:6,textTransform:"uppercase"}}>Categoria</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {[{k:"all",l:"Tutte"},{k:"colazione",l:"Colazione"},{k:"spuntino",l:"Spuntino"},{k:"pranzo",l:"Primo Piatto"},{k:"cena",l:"Secondo Piatto"}].map(c=>(
              <button key={c.k} onClick={()=>setCat(c.k)} className="btn" style={{padding:"5px 11px",background:cat===c.k?"#E07340":"#F5F0E8",color:cat===c.k?"#fff":"#264653",border:"none",borderRadius:20,fontSize:12}}>{c.l}</button>
            ))}
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:14,padding:"10px 12px",marginTop:8,marginBottom:6,boxShadow:"0 1px 6px rgba(0,0,0,.06)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#aaa",marginBottom:6,textTransform:"uppercase"}}>Stagione e dieta</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {[{k:"all",l:"Tutte"},{k:"spring",l:"Primavera"},{k:"summer",l:"Estate"},{k:"autumn",l:"Autunno"},{k:"winter",l:"Inverno"}].map(s=>(
              <button key={s.k} onClick={()=>setSeason(s.k)} className="btn" style={{padding:"5px 11px",background:season===s.k?"#2A9D8F":"#F5F0E8",color:season===s.k?"#fff":"#264653",border:"none",borderRadius:20,fontSize:12}}>{s.l}</button>
            ))}
            <button onClick={()=>setVeg(p=>!p)} className="btn" style={{padding:"5px 11px",background:veg?"#2D8A2D":"#F5F0E8",color:veg?"#fff":"#264653",border:"none",borderRadius:20,fontSize:12}}>Vegetariano</button>
          </div>
        </div>
      </div>
      <div className="cnt">
        {res.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:"#888"}}>Nessuna ricetta trovata</div>:
          res.map(r=><RCard key={r.id} r={r} onSel={setSel}/>)
        }
      </div>
    </div>
  );
}

// ── MENU TAB ──────────────────────────────────────────────────────────────
function MenuTab({curWk,wkMenus,db,profile,onWkChange,onUpdate,onSaveWk,savedMenus,onLoadMenu,onDelSaved,ratings,onRate}) {
  const [selDay, setSelDay] = useState(0);
  const [selR, setSelR] = useState(null);
  const [foodMeal, setFoodMeal] = useState(null);
  const [saveName, setSaveName] = useState("");
  const [showSave, setShowSave] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const curMenu = wkMenus[curWk]||initWkMenu();
  const tgt = calcTgt(profile);
  const dm = dayMacros(curMenu,db,DKEYS[selDay]);
  const pct = v => Math.min(100,Math.round(v/tgt.kcal*100));
  return (
    <div>
      {selR&&<RModal recipe={selR} onClose={()=>setSelR(null)} onAdd={onUpdate} ratings={ratings} onRate={onRate}/>}
      {foodMeal&&<FoodModal mealLabel={MEALS.find(m=>m.k===foodMeal)?.ml||foodMeal} onClose={()=>setFoodMeal(null)} onAdd={food=>{onUpdate(DKEYS[selDay],foodMeal,null,null,food);setFoodMeal(null);}}/>}
      <div className="hdr">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <h1>Menu</h1>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>shareWA(menuTxt(curMenu,db,curWk))} className="btn bs" style={{fontSize:11}}>WA</button>
            <button onClick={()=>setShowSave(p=>!p)} className="btn bs" style={{fontSize:11}}>Salva</button>
            <button onClick={()=>setShowSaved(p=>!p)} className="btn bs" style={{fontSize:11}}>({savedMenus.length})</button>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>onWkChange(shiftWk(curWk,-1))} className="btn" style={{background:"rgba(255,255,255,.2)",color:"#fff",padding:"4px 10px",borderRadius:8}}>◀</button>
          <span style={{flex:1,textAlign:"center",fontSize:13,fontWeight:700}}>{wkLabel(curWk)}</span>
          <button onClick={()=>onWkChange(shiftWk(curWk,1))} className="btn" style={{background:"rgba(255,255,255,.2)",color:"#fff",padding:"4px 10px",borderRadius:8}}>▶</button>
        </div>
        {showSave&&<div style={{marginTop:8,display:"flex",gap:6}}>
          <input value={saveName} onChange={e=>setSaveName(e.target.value)} placeholder="Nome per questo menu..." style={{flex:1,padding:"8px 12px",borderRadius:10,border:"none",fontSize:13}}/>
          <button onClick={()=>{if(saveName.trim()){onSaveWk(saveName.trim());setSaveName("");setShowSave(false);}}} className="btn" style={{background:"#fff",color:"#E07340",padding:"8px 12px",borderRadius:10,fontSize:13,fontWeight:700}}>Salva</button>
        </div>}
      </div>
      {showSaved&&savedMenus.length>0&&<div className="cd">
        <div style={{fontWeight:700,color:"#264653",marginBottom:8,fontSize:13}}>Archivio menu</div>
        {savedMenus.map(sm=>(
          <div key={sm.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #F5F0E8"}}>
            <div style={{flex:1}}><div style={{fontWeight:600,color:"#264653",fontSize:13}}>{sm.name}</div><div style={{fontSize:11,color:"#888"}}>{wkLabel(sm.wk)}</div></div>
            <button onClick={()=>{onLoadMenu(sm);setShowSaved(false);}} className="btn bg" style={{fontSize:11}}>Carica</button>
            <button onClick={()=>onDelSaved(sm.id)} className="btn bs" style={{fontSize:11}}>X</button>
          </div>
        ))}
      </div>}
      <div style={{display:"flex",overflowX:"auto",padding:"10px 12px",gap:6,scrollbarWidth:"none"}}>
        {DAYS.map((d,i)=>{
          const hasFood = MEALS.some(m=>curMenu[DKEYS[i]]?.[m.k]);
          const dm2 = dayMacros(curMenu,db,DKEYS[i]);
          return (<button key={d} onClick={()=>setSelDay(i)} className="btn" style={{flexShrink:0,padding:"8px 10px",background:selDay===i?"#E07340":"#fff",color:selDay===i?"#fff":"#264653",border:"2px solid "+(selDay===i?"#E07340":"#E8E0D8"),borderRadius:14,fontSize:11,display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
            <span style={{fontWeight:800}}>{d.slice(0,3)}</span>
            {hasFood&&<span style={{fontSize:9,opacity:.8}}>{dm2.kcal}kcal</span>}
          </button>);
        })}
      </div>
      <div className="cd">
        <div style={{fontWeight:700,color:"#264653",marginBottom:10,fontSize:13}}>{DAYS[selDay]} — Riepilogo</div>
        <div style={{marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#888",marginBottom:3}}>
            <span>Calorie</span><span style={{fontWeight:700,color:"#E07340"}}>{dm.kcal}/{tgt.kcal} kcal</span>
          </div>
          <div className="pb"><div className="pf" style={{width:pct(dm.kcal)+"%",background:"#E07340"}}/></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{l:"Prot",v:dm.prot,t:tgt.prot,c:"#2A9D8F"},{l:"Carb",v:dm.carb,t:tgt.carb,c:"#E9A820"},{l:"Grassi",v:dm.fat,t:tgt.fat,c:"#9C6B9E"}].map(m=>(
            <div key={m.l} style={{flex:1}}>
              <div style={{fontSize:10,color:m.c,fontWeight:700,marginBottom:2}}>{m.l}: {m.v}g/{m.t}g</div>
              <div className="pb"><div className="pf" style={{width:Math.min(100,m.t>0?m.v/m.t*100:0)+"%",background:m.c}}/></div>
            </div>
          ))}
        </div>
      </div>
      <div className="cnt">
        {MEALS.map(mt=>{
          const e = curMenu[DKEYS[selDay]]?.[mt.k];
          const r = e?.rid ? db.find(x=>x.id===e.rid) : null;
          const isFood = !r && e?.fid;
          const hasEntry = r||isFood;
          return (
            <div key={mt.k} className="cd" style={{border:"1px solid #F0E8DF"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:hasEntry?8:0}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:18}}>{mt.i}</span>
                  <span style={{fontWeight:700,color:"#264653",fontSize:13}}>{mt.ml}</span>
                </div>
                <div style={{display:"flex",gap:5}}>
                  {!hasEntry&&<button className="btn bg" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>setFoodMeal(mt.k)}>+ Alimento</button>}
                  {hasEntry&&<button className="btn bs" style={{fontSize:11}} onClick={()=>onUpdate(DKEYS[selDay],mt.k,null,null)}>X</button>}
                </div>
              </div>
              {r&&<div onClick={()=>setSelR(r)} style={{cursor:"pointer"}}>
                <div style={{fontWeight:600,color:"#264653",fontSize:13,marginBottom:6}}>{r.name}</div>
                <div style={{display:"flex"}}>
                  {[{l:"kcal",v:r.kcal,c:"#E07340"},{l:"prot",v:r.prot+"g",c:"#2A9D8F"},{l:"carb",v:r.carb+"g",c:"#E9A820"},{l:"grassi",v:r.fat+"g",c:"#9C6B9E"}].map(m=>(
                    <div key={m.l} style={{flex:1,textAlign:"center"}}><div style={{fontWeight:800,color:m.c,fontSize:12}}>{m.v}</div><div style={{fontSize:10,color:"#999"}}>{m.l}</div></div>
                  ))}
                </div>
              </div>}
              {isFood&&<div>
                <div style={{fontWeight:600,color:"#264653",fontSize:13,marginBottom:6}}>{e.name}</div>
                <div style={{display:"flex"}}>
                  {[{l:"kcal",v:e.kcal,c:"#E07340"},{l:"prot",v:e.prot+"g",c:"#2A9D8F"},{l:"carb",v:e.carb+"g",c:"#E9A820"},{l:"grassi",v:e.fat+"g",c:"#9C6B9E"}].map(m=>(
                    <div key={m.l} style={{flex:1,textAlign:"center"}}><div style={{fontWeight:800,color:m.c,fontSize:12}}>{m.v}</div><div style={{fontSize:10,color:"#999"}}>{m.l}</div></div>
                  ))}
                </div>
              </div>}
              {!hasEntry&&<div style={{color:"#CCC",fontSize:12,fontStyle:"italic",paddingTop:4}}>Facoltativo</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SHOP TAB ──────────────────────────────────────────────────────────────
function ShopTab({curMenu, db}) {
  const [checked, setChecked] = useState({});
  const items = getShop(curMenu, db);
  const toggle = k => setChecked(p=>({...p,[k]:!p[k]}));
  const grouped = {};
  items.forEach(it=>{const c=it.cat||"altro";if(!grouped[c])grouped[c]=[];grouped[c].push(it);});
  const done = items.filter(it=>checked[it.name.toLowerCase()]).length;
  return (
    <div>
      <div className="hdr">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><h1>Lista Spesa</h1><p>{done}/{items.length} spuntati</p></div>
          <button onClick={()=>shareWA(shopTxt(curMenu,db))} className="btn bs" style={{fontSize:11}}>WhatsApp</button>
        </div>
      </div>
      {items.length===0?<div style={{textAlign:"center",padding:"60px 20px"}}>
        <div style={{fontSize:48,marginBottom:12}}>🛒</div>
        <div style={{color:"#888",fontSize:14}}>Aggiungi ricette al menu per generare la lista</div>
      </div>:
      <div className="cnt" style={{padding:"8px 0 84px"}}>
        {done>0&&<div style={{margin:"4px 12px 6px",textAlign:"right"}}><button className="btn bs" onClick={()=>setChecked({})}>Reset</button></div>}
        {CATS.filter(c=>grouped[c.k]).map(c=>(
          <div key={c.k}>
            <div style={{padding:"8px 16px",fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase"}}>{c.l}</div>
            {grouped[c.k].map(it=>{
              const k = it.name.toLowerCase();
              return (
                <div key={k} onClick={()=>toggle(k)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:checked[k]?"#F9F9F9":"#fff",borderBottom:"1px solid #F5F0E8",cursor:"pointer",opacity:checked[k]?.5:1}}>
                  <div style={{width:22,height:22,borderRadius:11,border:"2px solid "+(checked[k]?"#2A9D8F":"#DDD"),background:checked[k]?"#2A9D8F":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {checked[k]&&<span style={{color:"#fff",fontSize:13}}>✓</span>}
                  </div>
                  <span style={{flex:1,fontSize:13,color:"#264653",textDecoration:checked[k]?"line-through":"none"}}>{it.name}</span>
                  <span style={{fontSize:13,color:"#888",fontWeight:600}}>{it.unit==="q.b."?"q.b.":Math.round(it.amount)+it.unit}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>}
    </div>
  );
}

// ── PROFILE TAB ───────────────────────────────────────────────────────────
function ProfileTab({profile, user, onUpdate, onLogout}) {
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({...profile});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const tgt = calcTgt(profile);
  const handleLogout = async () => {
    try { await auth_fb.signOut(auth_fb.inst); onLogout(); } catch(e) {}
  };
  return (
    <div>
      <div className="hdr"><h1>Profilo</h1><p>Ciao, {profile.name}!</p></div>
      <div className="cnt">
        {user&&<div className="cd" style={{display:"flex",alignItems:"center",gap:12}}>
          {user.photoURL&&<img src={user.photoURL} style={{width:48,height:48,borderRadius:24}} alt="avatar"/>}
          <div>
            <div style={{fontWeight:700,color:"#264653",fontSize:14}}>{user.displayName}</div>
            <div style={{fontSize:12,color:"#888"}}>{user.email}</div>
          </div>
        </div>}
        <div className="cd">
          <div style={{fontWeight:700,color:"#264653",marginBottom:10,fontSize:14}}>Il tuo fabbisogno</div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {[{l:"Calorie",v:tgt.kcal+"kcal",c:"#E07340"},{l:"Proteine",v:tgt.prot+"g",c:"#2A9D8F"},{l:"Carb",v:tgt.carb+"g",c:"#E9A820"},{l:"Grassi",v:tgt.fat+"g",c:"#9C6B9E"}].map(m=>(
              <div key={m.l} style={{flex:1,background:m.c+"11",borderRadius:10,padding:"8px 4px",textAlign:"center"}}>
                <div style={{fontWeight:800,color:m.c,fontSize:13}}>{m.v}</div>
                <div style={{fontSize:10,color:"#888",marginTop:2}}>{m.l}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,color:"#666",display:"flex",gap:10,flexWrap:"wrap"}}>
            <span>{profile.sex==="M"?"Maschio":"Femmina"}</span>
            <span>{profile.age} anni</span>
            <span>{profile.height}cm</span>
            <span>{profile.weight}kg</span>
            <span>{ACT.find(a=>a.k===profile.activity)?.l}</span>
            <span>{GOALS.find(g=>g.k===profile.goal)?.l}</span>
          </div>
        </div>
        {!editing?<div style={{padding:"0 12px"}}><button className="btn bp" onClick={()=>setEditing(true)}>Modifica profilo</button></div>:
          <div className="cd">
            {[{k:"age",l:"Eta (anni)"},{k:"height",l:"Altezza (cm)"},{k:"weight",l:"Peso (kg)"}].map(fd=>(
              <div key={fd.k} style={{marginBottom:10}}><label className="lbl" style={{fontSize:12}}>{fd.l}</label><input className="inp" type="number" value={f[fd.k]} onChange={e=>set(fd.k,+e.target.value)}/></div>
            ))}
            <label className="lbl" style={{fontSize:12}}>Attivita</label>
            <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
              {ACT.map(a=><button key={a.k} onClick={()=>set("activity",a.k)} className="btn" style={{padding:"9px",textAlign:"left",background:f.activity===a.k?"#E07340":"#fff",color:f.activity===a.k?"#fff":"#264653",border:"2px solid "+(f.activity===a.k?"#E07340":"#E8E0D8"),borderRadius:10,fontSize:12}}>{a.l}</button>)}
            </div>
            <label className="lbl" style={{fontSize:12}}>Obiettivo</label>
            <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
              {GOALS.map(g=><button key={g.k} onClick={()=>set("goal",g.k)} className="btn" style={{padding:"9px",textAlign:"left",background:f.goal===g.k?"#E07340":"#fff",color:f.goal===g.k?"#fff":"#264653",border:"2px solid "+(f.goal===g.k?"#E07340":"#E8E0D8"),borderRadius:10,fontSize:12}}>{g.l}</button>)}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setEditing(false)} className="btn" style={{flex:1,padding:"11px",border:"2px solid #E8E0D8",color:"#888",background:"#fff"}}>Annulla</button>
              <button onClick={()=>{onUpdate(f);setEditing(false);}} className="btn bp" style={{flex:2}}>Salva</button>
            </div>
          </div>
        }
        <div style={{padding:"8px 12px"}}>
          <button onClick={handleLogout} className="btn" style={{width:"100%",padding:"11px",border:"2px solid #EEE",color:"#999",background:"#fff",fontSize:13,borderRadius:12}}>Esci dall'account</button>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [authState, setAuthState] = useState("loading"); // loading | loggedout | setup | ready
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wkMenus, setWkMenus] = useState({});
  const [curWk, setCurWk] = useState(getWkKey());
  const [savedMenus, setSavedMenus] = useState([]);
  const [customDB, setCustomDB] = useState([]);
  const [ratings, setRatings] = useState({});
  const [tab, setTab] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const db = [...DB0, ...customDB];
  const curMenu = wkMenus[curWk]||initWkMenu();

  useEffect(()=>{
    loadFirebase().then(()=>{
      if(!auth_fb) { setAuthState("loggedout"); return; }
      const { onAuthStateChanged } = auth_fb;
      // fallback senza onAuthStateChanged
      const unsubFn = auth_fb.inst.onAuthStateChanged
        ? auth_fb.inst.onAuthStateChanged
        : null;
      if(!unsubFn){ setAuthState("loggedout"); return; }
      const unsub = unsubFn(async fbUser => {
        if(fbUser){
          setUser(fbUser);
          try{
            const data = await loadFromCloud(fbUser.uid);
            if(data){
              setProfile(data.profile||null);
              setWkMenus(data.wkMenus||{});
              setCurWk(data.curWk||getWkKey());
              setSavedMenus(data.savedMenus||[]);
              setCustomDB(data.customDB||[]);
              setRatings(data.ratings||{});
              setAuthState("ready");
            } else {
              setAuthState("setup");
            }
          }catch(e){ setAuthState("setup"); }
        } else {
          setUser(null);
          setAuthState("loggedout");
        }
      });
      return ()=>unsub && unsub();
    });
  },[]);

  const persist = (p,wm,cw,sm,cdb,rt) => {
    if(!user) return;
    saveToCloud(user.uid, {profile:p,wkMenus:wm,curWk:cw,savedMenus:sm,customDB:cdb,ratings:rt}).catch(()=>{});
  };

  const handleSetup = p => {
    setProfile(p);
    setAuthState("ready");
    persist(p,wkMenus,curWk,savedMenus,customDB,ratings);
  };
  const updateProfile = p => { setProfile(p); persist(p,wkMenus,curWk,savedMenus,customDB,ratings); };
  const changeWk = wk => { setCurWk(wk); persist(profile,wkMenus,wk,savedMenus,customDB,ratings); };
  const updateMenu = (day,meal,rid,shopP,food=null) => {
    const entry = food?food:rid?{rid,shopP:shopP||1}:null;
    const nwm = {...wkMenus,[curWk]:{...curMenu,[day]:{...curMenu[day],[meal]:entry}}};
    setWkMenus(nwm); persist(profile,nwm,curWk,savedMenus,customDB,ratings);
  };
  const saveWk = name => {
    const nsm = [...savedMenus,{id:Date.now(),name,wk:curWk,data:JSON.parse(JSON.stringify(curMenu))}];
    setSavedMenus(nsm); persist(profile,wkMenus,curWk,nsm,customDB,ratings);
  };
  const loadMenu = sm => {
    const nwm = {...wkMenus,[curWk]:sm.data};
    setWkMenus(nwm); persist(profile,nwm,curWk,savedMenus,customDB,ratings);
  };
  const delSaved = id => {
    const nsm = savedMenus.filter(s=>s.id!==id);
    setSavedMenus(nsm); persist(profile,wkMenus,curWk,nsm,customDB,ratings);
  };
  const addRecipe = r => { const ncdb=[...customDB,r]; setCustomDB(ncdb); persist(profile,wkMenus,curWk,savedMenus,ncdb,ratings); };
  const rateR = (id,s) => { const nr={...ratings,[id]:s}; setRatings(nr); persist(profile,wkMenus,curWk,savedMenus,customDB,nr); };
  const handleLogout = () => { setProfile(null); setUser(null); setAuthState("loggedout"); };

  if(authState==="loading") return (
    <div className="app"><style>{CSS}</style>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#FFF8F0",flexDirection:"column",gap:16}}>
        <div style={{fontSize:48}}>🫒</div>
        <div style={{color:"#E07340",fontSize:14,fontWeight:600}}>Caricamento...</div>
      </div>
    </div>
  );

  if(authState==="loggedout") return <LoginScreen onLogin={u=>{setUser(u);setAuthState("setup");}}/>;
  if(authState==="setup") return <Setup user={user} onDone={handleSetup}/>;

  const TABS = [{i:"🔍",l:"Ricette"},{i:"📅",l:"Menu"},{i:"🛒",l:"Spesa"},{i:"👤",l:"Profilo"}];
  return (
    <div className="app">
      <style>{CSS}</style>
      {tab===0&&<SearchTab db={db} onAddToMenu={updateMenu} ratings={ratings} onRate={rateR}/>}
      {tab===1&&<MenuTab curWk={curWk} wkMenus={wkMenus} db={db} profile={profile} onWkChange={changeWk} onUpdate={updateMenu} onSaveWk={saveWk} savedMenus={savedMenus} onLoadMenu={loadMenu} onDelSaved={delSaved} ratings={ratings} onRate={rateR}/>}
      {tab===2&&<ShopTab curMenu={curMenu} db={db}/>}
      {tab===3&&<ProfileTab profile={profile} user={user} onUpdate={updateProfile} onLogout={handleLogout}/>}
      <div className="tbar">
        {TABS.map((t,i)=><button key={i} className={"tab"+(tab===i?" on":"")} onClick={()=>setTab(i)}><span className="ic">{t.i}</span><span>{t.l}</span></button>)}
        <button className={"tab"+(showAdd?" on":"")} onClick={()=>setShowAdd(p=>!p)}><span className="ic">+</span><span>Ricetta</span></button>
      </div>
    </div>
  );
}