import { useState, useEffect } from "react";

const MEALS=[{k:"colazione",l:"Colazione",ml:"Colazione",i:"☀️",c:"#E07340"},{k:"spuntino",l:"Spuntino",ml:"Spuntino",i:"🍎",c:"#E9A820"},{k:"pranzo",l:"Primo Piatto",ml:"Pranzo",i:"🍝",c:"#2A9D8F"},{k:"cena",l:"Secondo Piatto",ml:"Cena",i:"🥩",c:"#5C7CFA"}];
const DAYS=["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"];
const DKEYS=["lun","mar","mer","gio","ven","sab","dom"];
const ACT=[{k:"sedentary",l:"Sedentario",m:1.2},{k:"light",l:"Leggero",m:1.375},{k:"moderate",l:"Moderato",m:1.55},{k:"active",l:"Attivo",m:1.725},{k:"veryActive",l:"Molto attivo",m:1.9}];
const GOALS=[{k:"loss",l:"🔻 Dimagrimento",adj:-300},{k:"maintain",l:"⚖️ Mantenimento",adj:0},{k:"gain",l:"💪 Aumento massa",adj:300}];
const SEASONS={all:"Tutto l'anno",spring:"Primavera",summer:"Estate",autumn:"Autunno",winter:"Inverno"};
const CATS=[{k:"verdure",l:"🥬 Verdure"},{k:"pesce",l:"🐟 Pesce/Carne"},{k:"latticini",l:"🧀 Latticini"},{k:"cereali",l:"🌾 Cereali"},{k:"legumi",l:"🫘 Legumi"},{k:"frutta",l:"🍎 Frutta"},{k:"condimenti",l:"🫙 Condimenti"},{k:"altro",l:"📦 Altro"}];
const SK="medmenu_v3";

const DB0=[
{id:1,name:"Pane, burro d'arachidi e marmellata",cat:"colazione",veg:true,season:"all",tags:["pane","arachidi","marmellata","dolce","veloce"],ing:[{n:"Pane integrale",a:80,u:"g",c:"cereali"},{n:"Burro d'arachidi",a:30,u:"g",c:"condimenti"},{n:"Marmellata",a:20,u:"g",c:"altro"}],proc:"Tostare il pane e spalmare burro d'arachidi e marmellata.",kcal:370,prot:12,carb:48,fat:14,t:5},
{id:2,name:"Plum cake proteico all'avena",cat:"colazione",veg:true,season:"all",tags:["plum cake","avena","yogurt greco","cioccolato","proteico"],ing:[{n:"Yogurt greco",a:250,u:"g",c:"latticini"},{n:"Farina d'avena",a:45,u:"g",c:"cereali"},{n:"Uovo",a:60,u:"g",c:"altro"},{n:"Albume",a:35,u:"g",c:"altro"},{n:"Cioccolato fondente",a:20,u:"g",c:"altro"}],proc:"Mescolare tutto, versare in stampo e cuocere a 180°C per 25-30 min.",kcal:420,prot:28,carb:40,fat:12,t:35},
{id:3,name:"Yogurt greco con crusca, miele e banana",cat:"colazione",veg:true,season:"all",tags:["yogurt greco","crusca","miele","mandorle","banana","cioccolato"],ing:[{n:"Yogurt greco",a:200,u:"g",c:"latticini"},{n:"Crusca d'avena",a:30,u:"g",c:"cereali"},{n:"Miele",a:15,u:"g",c:"condimenti"},{n:"Mandorle",a:15,u:"g",c:"frutta"},{n:"Banana",a:100,u:"g",c:"frutta"},{n:"Gocce di cioccolato",a:10,u:"g",c:"altro"}],proc:"Versare lo yogurt in una ciotola e aggiungere tutti gli ingredienti.",kcal:390,prot:22,carb:46,fat:12,t:5},
{id:4,name:"Bounty al cocco frozen",cat:"colazione",veg:true,season:"all",tags:["yogurt greco","cocco","freezer","dolce","proteico"],ing:[{n:"Yogurt greco",a:300,u:"g",c:"latticini"},{n:"Farina di cocco",a:45,u:"g",c:"altro"},{n:"Miele",a:10,u:"g",c:"condimenti"}],proc:"Mescolare yogurt, cocco e miele. Congelare 2+ ore, togliere 10 min prima di servire.",kcal:320,prot:22,carb:20,fat:12,t:10},
{id:5,name:"Frozen yogurt caffè e cacao",cat:"colazione",veg:true,season:"summer",tags:["yogurt","caffè","cacao","freezer","estate"],ing:[{n:"Yogurt bianco",a:250,u:"g",c:"latticini"},{n:"Caffè espresso",a:30,u:"ml",c:"altro"},{n:"Cacao amaro",a:10,u:"g",c:"altro"},{n:"Miele",a:10,u:"g",c:"condimenti"}],proc:"Mescolare tutto e congelare 3-4 ore. Servire semi-gelato.",kcal:270,prot:14,carb:28,fat:8,t:10},
{id:6,name:"Yogurt greco con frutti rossi e cioccolato",cat:"colazione",veg:true,season:"all",tags:["yogurt greco","frutti rossi","cioccolato","veloce"],ing:[{n:"Yogurt greco",a:200,u:"g",c:"latticini"},{n:"Frutti rossi",a:120,u:"g",c:"frutta"},{n:"Gocce di cioccolato",a:15,u:"g",c:"altro"},{n:"Miele",a:10,u:"g",c:"condimenti"}],proc:"Versare yogurt in ciotola. Aggiungere frutti rossi, gocce di cioccolato e miele.",kcal:265,prot:18,carb:32,fat:6,t:3},
{id:7,name:"Overnight porridge con frutti rossi",cat:"colazione",veg:true,season:"all",tags:["avena","porridge","overnight","frutti rossi","cioccolato"],ing:[{n:"Fiocchi d'avena",a:80,u:"g",c:"cereali"},{n:"Latte",a:150,u:"ml",c:"latticini"},{n:"Yogurt greco",a:100,u:"g",c:"latticini"},{n:"Frutti rossi",a:100,u:"g",c:"frutta"},{n:"Gocce di cioccolato",a:15,u:"g",c:"altro"}],proc:"Mescolare avena, latte e yogurt la sera. Riporre in frigo tutta la notte. Al mattino aggiungere frutti rossi e cioccolato.",kcal:430,prot:22,carb:58,fat:11,t:5},
{id:8,name:"Pancake di albumi e avena con frutta",cat:"colazione",veg:true,season:"all",tags:["pancake","albumi","avena","frutta","proteico"],ing:[{n:"Albumi",a:200,u:"g",c:"altro"},{n:"Farina d'avena",a:50,u:"g",c:"cereali"},{n:"Frutta fresca",a:120,u:"g",c:"frutta"},{n:"Lievito",a:3,u:"g",c:"altro"},{n:"Miele",a:10,u:"g",c:"condimenti"}],proc:"Frullare albumi, avena e lievito. Cuocere piccoli dischi in padella antiaderente 2 min per lato. Servire con frutta.",kcal:350,prot:22,carb:42,fat:5,t:15},
{id:9,name:"Pancake di albumi e banana",cat:"colazione",veg:true,season:"all",tags:["pancake","albumi","banana","proteico","fitness"],ing:[{n:"Albumi",a:200,u:"g",c:"altro"},{n:"Banana matura",a:120,u:"g",c:"frutta"}],proc:"Schiacciare la banana e mescolare con gli albumi. Cuocere piccoli dischi in padella antiaderente 2-3 min per lato.",kcal:200,prot:18,carb:30,fat:1,t:10},
{id:10,name:"Hummus con crudité",cat:"spuntino",veg:true,season:"all",tags:["hummus","ceci","verdure","vegano","tahini"],ing:[{n:"Ceci cotti",a:150,u:"g",c:"legumi"},{n:"Tahini",a:20,u:"g",c:"condimenti"},{n:"Limone",a:15,u:"ml",c:"frutta"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"},{n:"Carote",a:80,u:"g",c:"verdure"},{n:"Sedano",a:60,u:"g",c:"verdure"}],proc:"Frullare ceci, tahini, limone e olio. Servire con crudité.",kcal:260,prot:11,carb:28,fat:12,t:10},
{id:11,name:"Bruschetta al pomodoro",cat:"spuntino",veg:true,season:"summer",tags:["bruschetta","pomodoro","basilico","italiano"],ing:[{n:"Pane casereccio",a:60,u:"g",c:"cereali"},{n:"Pomodori maturi",a:150,u:"g",c:"verdure"},{n:"Basilico",a:5,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Tostare il pane. Condire pomodori a cubetti con olio e basilico. Disporre sul pane.",kcal:210,prot:5,carb:30,fat:8,t:10},
{id:12,name:"Yogurt con granola e frutti di bosco",cat:"spuntino",veg:true,season:"all",tags:["yogurt","granola","frutti di bosco"],ing:[{n:"Yogurt bianco",a:150,u:"g",c:"latticini"},{n:"Granola",a:30,u:"g",c:"cereali"},{n:"Frutti di bosco",a:80,u:"g",c:"frutta"},{n:"Miele",a:10,u:"g",c:"condimenti"}],proc:"Versare yogurt, aggiungere frutti di bosco, granola e miele.",kcal:270,prot:9,carb:38,fat:8,t:3},
{id:13,name:"Mix di frutta secca e mela",cat:"spuntino",veg:true,season:"all",tags:["frutta secca","noci","mandorle","mela"],ing:[{n:"Mandorle",a:20,u:"g",c:"frutta"},{n:"Noci",a:15,u:"g",c:"frutta"},{n:"Mela",a:150,u:"g",c:"frutta"}],proc:"Lavare e tagliare la mela. Servire con frutta secca.",kcal:230,prot:5,carb:26,fat:13,t:2},
{id:14,name:"Feta con olive e pomodorini",cat:"spuntino",veg:true,season:"all",tags:["feta","olive","pomodorini","formaggio"],ing:[{n:"Feta",a:60,u:"g",c:"latticini"},{n:"Olive miste",a:40,u:"g",c:"verdure"},{n:"Pomodorini",a:100,u:"g",c:"verdure"},{n:"Olio EVO",a:5,u:"ml",c:"condimenti"}],proc:"Disporre feta, pomodorini e olive. Condire con olio e origano.",kcal:220,prot:9,carb:7,fat:18,t:5},
{id:20,name:"Pasta al sugo con feta",cat:"pranzo",veg:true,season:"all",tags:["pasta","feta","sugo","pomodoro","vegetariano"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Salsa di pomodoro",a:200,u:"g",c:"verdure"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"},{n:"Aglio",a:5,u:"g",c:"verdure"}],proc:"Soffriggere aglio, aggiungere salsa 10 min. Aggiungere metà feta in cottura. Condire la pasta con feta restante a crudo.",kcal:460,prot:18,carb:64,fat:15,t:20},
{id:21,name:"Pasta con pesce spada e melanzane",cat:"pranzo",veg:false,season:"summer",tags:["pasta","pesce spada","melanzane","ricotta"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Pesce spada",a:150,u:"g",c:"pesce"},{n:"Melanzane",a:150,u:"g",c:"verdure"},{n:"Ricotta",a:60,u:"g",c:"latticini"},{n:"Pomodorini",a:100,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Rosolare melanzane, aggiungere pomodorini e pesce spada a dadini 5 min. Condire la pasta con sugo e ricotta.",kcal:520,prot:34,carb:60,fat:16,t:25},
{id:22,name:"Pasta e zucchine con feta",cat:"pranzo",veg:true,season:"summer",tags:["pasta","zucchine","feta","vegetariano","veloce"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Zucchine",a:200,u:"g",c:"verdure"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"},{n:"Aglio",a:5,u:"g",c:"verdure"}],proc:"Cuocere zucchine sottili in olio 2 min. Coprire d'acqua, portare a ebollizione, aggiungere pasta. A fine cottura mantecare con feta.",kcal:450,prot:17,carb:62,fat:14,t:20},
{id:23,name:"Pasta e legumi",cat:"pranzo",veg:true,season:"all",tags:["pasta","fagioli","legumi","vegetariano"],ing:[{n:"Pasta corta",a:70,u:"g",c:"cereali"},{n:"Fagioli cannellini",a:150,u:"g",c:"legumi"},{n:"Pomodori pelati",a:150,u:"g",c:"verdure"},{n:"Rosmarino",a:2,u:"g",c:"condimenti"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Soffriggere aglio e rosmarino. Aggiungere fagioli, pomodori e brodo. Cuocere 10 min, aggiungere pasta.",kcal:440,prot:18,carb:72,fat:9,t:30},
{id:24,name:"Tagliatelle con melanzane e tonno",cat:"pranzo",veg:false,season:"summer",tags:["tagliatelle","tonno","melanzane","pomodorini"],ing:[{n:"Tagliatelle",a:80,u:"g",c:"cereali"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Melanzane",a:150,u:"g",c:"verdure"},{n:"Pomodorini",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Rosolare melanzane, aggiungere pomodorini 10 min. Condire le tagliatelle con sugo e tonno.",kcal:480,prot:28,carb:64,fat:12,t:25},
{id:25,name:"Tagliatelle con melanzane e pesce spada",cat:"pranzo",veg:false,season:"summer",tags:["tagliatelle","pesce spada","melanzane"],ing:[{n:"Tagliatelle",a:80,u:"g",c:"cereali"},{n:"Pesce spada",a:150,u:"g",c:"pesce"},{n:"Melanzane",a:150,u:"g",c:"verdure"},{n:"Pomodorini",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Rosolare melanzane e pomodorini. Aggiungere pesce spada a dadini 5 min. Condire le tagliatelle.",kcal:490,prot:32,carb:64,fat:12,t:25},
{id:26,name:"Tagliatelle con melanzane e ricciola",cat:"pranzo",veg:false,season:"summer",tags:["tagliatelle","ricciola","melanzane"],ing:[{n:"Tagliatelle",a:80,u:"g",c:"cereali"},{n:"Ricciola",a:150,u:"g",c:"pesce"},{n:"Melanzane",a:150,u:"g",c:"verdure"},{n:"Pomodorini",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Rosolare melanzane e pomodorini. Aggiungere ricciola a dadini 5 min. Condire le tagliatelle.",kcal:490,prot:30,carb:64,fat:13,t:25},
{id:27,name:"Gnocchi crema di zucchine e tonno",cat:"pranzo",veg:false,season:"all",tags:["gnocchi","zucchine","tonno","crema"],ing:[{n:"Gnocchi di patate",a:200,u:"g",c:"cereali"},{n:"Zucchine",a:200,u:"g",c:"verdure"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere zucchine al vapore/friggitrice e frullare. Condire gnocchi al dente con crema e tonno.",kcal:420,prot:26,carb:52,fat:12,t:20},
{id:28,name:"Gnocchi crema di zucchine e feta",cat:"pranzo",veg:true,season:"all",tags:["gnocchi","zucchine","feta","crema","vegetariano"],ing:[{n:"Gnocchi di patate",a:200,u:"g",c:"cereali"},{n:"Zucchine",a:200,u:"g",c:"verdure"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere zucchine al vapore e frullare. Condire gnocchi al dente con crema e feta sbriciolata.",kcal:430,prot:18,carb:54,fat:15,t:20},
{id:29,name:"Gnocchi crema di melanzane e tonno",cat:"pranzo",veg:false,season:"all",tags:["gnocchi","melanzane","tonno","crema","forno"],ing:[{n:"Gnocchi di patate",a:200,u:"g",c:"cereali"},{n:"Melanzane",a:200,u:"g",c:"verdure"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere la melanzana intera al forno/friggitrice e frullare. Condire gnocchi con crema e tonno.",kcal:400,prot:26,carb:48,fat:11,t:35},
{id:30,name:"Gnocchi crema di melanzane e feta",cat:"pranzo",veg:true,season:"all",tags:["gnocchi","melanzane","feta","crema","vegetariano"],ing:[{n:"Gnocchi di patate",a:200,u:"g",c:"cereali"},{n:"Melanzane",a:200,u:"g",c:"verdure"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere melanzana intera al forno e frullare. Condire gnocchi con crema e feta.",kcal:410,prot:16,carb:50,fat:15,t:40},
{id:31,name:"Gnocchi crema di piselli e tonno",cat:"pranzo",veg:false,season:"spring",tags:["gnocchi","piselli","tonno","crema","primavera"],ing:[{n:"Gnocchi di patate",a:200,u:"g",c:"cereali"},{n:"Piselli",a:150,u:"g",c:"legumi"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Menta",a:3,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere i piselli e frullare con menta. Condire gnocchi con crema e tonno.",kcal:430,prot:28,carb:56,fat:10,t:20},
{id:32,name:"Pasta crema di zucchine e tonno",cat:"pranzo",veg:false,season:"all",tags:["pasta","zucchine","tonno","crema"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Zucchine",a:200,u:"g",c:"verdure"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere zucchine al vapore e frullare. Condire la pasta con crema e tonno.",kcal:450,prot:26,carb:62,fat:12,t:20},
{id:33,name:"Pasta crema di zucchine e feta",cat:"pranzo",veg:true,season:"all",tags:["pasta","zucchine","feta","crema","vegetariano"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Zucchine",a:200,u:"g",c:"verdure"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere zucchine al vapore e frullare. Condire la pasta con crema e feta.",kcal:460,prot:17,carb:64,fat:15,t:20},
{id:34,name:"Pasta crema di melanzane e tonno",cat:"pranzo",veg:false,season:"all",tags:["pasta","melanzane","tonno","crema"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Melanzane",a:200,u:"g",c:"verdure"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere melanzana al forno e frullare. Condire la pasta con crema e tonno.",kcal:440,prot:26,carb:60,fat:12,t:35},
{id:35,name:"Pasta crema di melanzane e feta",cat:"pranzo",veg:true,season:"all",tags:["pasta","melanzane","feta","crema","vegetariano"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Melanzane",a:200,u:"g",c:"verdure"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere melanzana al forno e frullare. Condire la pasta con crema e feta.",kcal:450,prot:17,carb:62,fat:15,t:35},
{id:36,name:"Pasta crema di piselli e tonno",cat:"pranzo",veg:false,season:"spring",tags:["pasta","piselli","tonno","crema","primavera"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Piselli",a:150,u:"g",c:"legumi"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Menta",a:3,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Frullare piselli cotti con menta. Condire la pasta con crema e tonno.",kcal:460,prot:28,carb:64,fat:10,t:20},
{id:37,name:"Couscous con verdure e legumi",cat:"pranzo",veg:true,season:"all",tags:["couscous","verdure","ceci","legumi","vegano"],ing:[{n:"Couscous",a:80,u:"g",c:"cereali"},{n:"Ceci cotti",a:100,u:"g",c:"legumi"},{n:"Zucchine",a:100,u:"g",c:"verdure"},{n:"Peperoni",a:80,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Idratare il couscous con brodo caldo. Saltare verdure e ceci. Mescolare e condire.",kcal:390,prot:16,carb:62,fat:8,t:20},
{id:38,name:"Couscous con verdure e feta",cat:"pranzo",veg:true,season:"all",tags:["couscous","verdure","feta","vegetariano"],ing:[{n:"Couscous",a:80,u:"g",c:"cereali"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Idratare il couscous. Saltare verdure. Mescolare con feta sbriciolata.",kcal:420,prot:16,carb:58,fat:14,t:20},
{id:39,name:"Couscous con verdure e pollo",cat:"pranzo",veg:false,season:"all",tags:["couscous","verdure","pollo","proteico"],ing:[{n:"Couscous",a:80,u:"g",c:"cereali"},{n:"Petto di pollo",a:150,u:"g",c:"pesce"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"},{n:"Spezie miste",a:3,u:"g",c:"condimenti"}],proc:"Idratare il couscous. Cuocere pollo con spezie. Saltare verdure. Mescolare.",kcal:430,prot:28,carb:56,fat:8,t:25},
{id:40,name:"Couscous con verdure e tonno",cat:"pranzo",veg:false,season:"all",tags:["couscous","verdure","tonno","veloce"],ing:[{n:"Couscous",a:80,u:"g",c:"cereali"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Idratare il couscous. Saltare verdure. Mescolare con tonno sgocciolato.",kcal:410,prot:26,carb:58,fat:7,t:20},
{id:41,name:"Quinoa con verdure e legumi",cat:"pranzo",veg:true,season:"all",tags:["quinoa","verdure","ceci","legumi","vegano","senza glutine"],ing:[{n:"Quinoa",a:80,u:"g",c:"cereali"},{n:"Ceci cotti",a:120,u:"g",c:"legumi"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere quinoa 15 min. Saltare verdure e ceci. Mescolare e condire.",kcal:400,prot:18,carb:60,fat:10,t:20},
{id:42,name:"Quinoa con verdure e feta",cat:"pranzo",veg:true,season:"all",tags:["quinoa","verdure","feta","vegetariano"],ing:[{n:"Quinoa",a:80,u:"g",c:"cereali"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere quinoa. Saltare verdure. Mescolare con feta sbriciolata.",kcal:430,prot:16,carb:56,fat:16,t:20},
{id:43,name:"Quinoa con verdure e pollo",cat:"pranzo",veg:false,season:"all",tags:["quinoa","verdure","pollo","proteico"],ing:[{n:"Quinoa",a:80,u:"g",c:"cereali"},{n:"Petto di pollo",a:150,u:"g",c:"pesce"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere quinoa e pollo separatamente. Saltare verdure. Mescolare tutto.",kcal:440,prot:28,carb:54,fat:10,t:25},
{id:44,name:"Quinoa con verdure e tonno",cat:"pranzo",veg:false,season:"all",tags:["quinoa","verdure","tonno","light"],ing:[{n:"Quinoa",a:80,u:"g",c:"cereali"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere quinoa. Saltare verdure. Mescolare con tonno sgocciolato.",kcal:420,prot:26,carb:56,fat:8,t:20},
{id:45,name:"Farro con verdure e legumi",cat:"pranzo",veg:true,season:"all",tags:["farro","verdure","legumi","vegano"],ing:[{n:"Farro perlato",a:80,u:"g",c:"cereali"},{n:"Fagioli borlotti",a:100,u:"g",c:"legumi"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere il farro 25-30 min. Saltare verdure con legumi. Mescolare.",kcal:410,prot:18,carb:66,fat:8,t:35},
{id:46,name:"Farro con verdure e feta",cat:"pranzo",veg:true,season:"all",tags:["farro","verdure","feta","vegetariano"],ing:[{n:"Farro perlato",a:80,u:"g",c:"cereali"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere il farro. Saltare verdure. Mescolare con feta sbriciolata.",kcal:440,prot:16,carb:62,fat:14,t:35},
{id:47,name:"Farro con verdure e pollo",cat:"pranzo",veg:false,season:"all",tags:["farro","verdure","pollo","proteico"],ing:[{n:"Farro perlato",a:80,u:"g",c:"cereali"},{n:"Petto di pollo",a:150,u:"g",c:"pesce"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere farro e pollo separatamente. Saltare verdure. Mescolare tutto.",kcal:450,prot:28,carb:60,fat:8,t:35},
{id:48,name:"Farro con verdure e tonno",cat:"pranzo",veg:false,season:"all",tags:["farro","verdure","tonno","light"],ing:[{n:"Farro perlato",a:80,u:"g",c:"cereali"},{n:"Tonno al naturale",a:120,u:"g",c:"pesce"},{n:"Verdure miste",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere il farro. Saltare verdure. Mescolare con tonno.",kcal:430,prot:26,carb:62,fat:7,t:35},
{id:49,name:"Pasta e broccoli con ceci",cat:"pranzo",veg:true,season:"winter",tags:["pasta","broccoli","ceci","vegetariano","invernale"],ing:[{n:"Pasta integrale",a:80,u:"g",c:"cereali"},{n:"Broccoli",a:200,u:"g",c:"verdure"},{n:"Ceci cotti",a:120,u:"g",c:"legumi"},{n:"Aglio",a:5,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Lessare broccoli, frullarne metà per la crema. Soffriggere aglio con ceci. Condire la pasta con crema e condimento.",kcal:440,prot:19,carb:68,fat:10,t:25},
{id:50,name:"Pasta e cavolfiore con legumi",cat:"pranzo",veg:true,season:"autumn",tags:["pasta","cavolfiore","legumi","vegetariano"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Cavolfiore",a:200,u:"g",c:"verdure"},{n:"Fagioli cannellini",a:100,u:"g",c:"legumi"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere il cavolfiore, frullarne metà. Saltare fagioli. Condire la pasta.",kcal:420,prot:16,carb:66,fat:9,t:25},
{id:51,name:"Pasta e cavolo nero con legumi",cat:"pranzo",veg:true,season:"winter",tags:["pasta","cavolo nero","legumi","vegetariano","toscano"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Cavolo nero",a:150,u:"g",c:"verdure"},{n:"Fagioli borlotti",a:100,u:"g",c:"legumi"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Sbollentare cavolo nero. Saltare con aglio e fagioli. Condire la pasta.",kcal:430,prot:17,carb:68,fat:9,t:25},
{id:52,name:"Pasta pomodorini, gamberi e piselli",cat:"pranzo",veg:false,season:"spring",tags:["pasta","gamberi","piselli","pomodorini","primavera"],ing:[{n:"Pasta di semola",a:80,u:"g",c:"cereali"},{n:"Gamberi",a:150,u:"g",c:"pesce"},{n:"Piselli",a:100,u:"g",c:"legumi"},{n:"Pomodorini",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Soffriggere aglio, aggiungere pomodorini e piselli. Aggiungere gamberi 5 min. Saltare la pasta nel sugo.",kcal:460,prot:28,carb:62,fat:11,t:25},
{id:53,name:"Orecchiette cime di rapa e fagioli",cat:"pranzo",veg:true,season:"autumn",tags:["orecchiette","cime di rapa","fagioli","pugliese","vegetariano"],ing:[{n:"Orecchiette",a:80,u:"g",c:"cereali"},{n:"Cime di rapa",a:200,u:"g",c:"verdure"},{n:"Fagioli borlotti",a:120,u:"g",c:"legumi"},{n:"Olio EVO",a:20,u:"ml",c:"condimenti"},{n:"Peperoncino",a:2,u:"g",c:"condimenti"}],proc:"Cuocere cime di rapa e pasta nella stessa acqua. Saltare con aglio, peperoncino e fagioli.",kcal:450,prot:18,carb:70,fat:11,t:30},
{id:54,name:"Riso venere con gamberi e zucchine",cat:"pranzo",veg:false,season:"all",tags:["riso venere","gamberi","zucchine"],ing:[{n:"Riso venere",a:80,u:"g",c:"cereali"},{n:"Gamberi",a:200,u:"g",c:"pesce"},{n:"Zucchine",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere riso venere 40 min. Saltare gamberi e zucchine. Mescolare.",kcal:460,prot:30,carb:58,fat:12,t:45},
{id:55,name:"Riso venere con ricciola/spada e zucchine",cat:"pranzo",veg:false,season:"all",tags:["riso venere","ricciola","pesce spada","zucchine"],ing:[{n:"Riso venere",a:80,u:"g",c:"cereali"},{n:"Ricciola o pesce spada",a:150,u:"g",c:"pesce"},{n:"Zucchine",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere riso venere 40 min. Rosolare il pesce a dadini con zucchine. Mescolare.",kcal:470,prot:31,carb:58,fat:13,t:45},
{id:56,name:"Polenta con pollo e bietole",cat:"pranzo",veg:false,season:"autumn",tags:["polenta","pollo","bietole","fagioli","tradizionale"],ing:[{n:"Farina di polenta",a:80,u:"g",c:"cereali"},{n:"Petto di pollo",a:150,u:"g",c:"pesce"},{n:"Bietole",a:150,u:"g",c:"verdure"},{n:"Fagioli borlotti",a:100,u:"g",c:"legumi"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere la polenta 40 min. Saltare pollo a dadini con bietole e fagioli. Servire sulla polenta.",kcal:460,prot:30,carb:56,fat:12,t:50},
{id:57,name:"Polenta con ratatouille e legumi",cat:"pranzo",veg:true,season:"summer",tags:["polenta","ratatouille","verdure","legumi","vegetariano"],ing:[{n:"Farina di polenta",a:80,u:"g",c:"cereali"},{n:"Melanzane",a:100,u:"g",c:"verdure"},{n:"Zucchine",a:100,u:"g",c:"verdure"},{n:"Ceci cotti",a:100,u:"g",c:"legumi"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere la polenta. Preparare ratatouille di verdure con ceci. Servire sulla polenta.",kcal:380,prot:14,carb:58,fat:10,t:50},
{id:58,name:"Polenta con carne macinata al sugo",cat:"pranzo",veg:false,season:"winter",tags:["polenta","carne macinata","sugo","invernale"],ing:[{n:"Farina di polenta",a:80,u:"g",c:"cereali"},{n:"Carne macinata",a:150,u:"g",c:"pesce"},{n:"Salsa di pomodoro",a:150,u:"g",c:"verdure"},{n:"Cipolla",a:60,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere la polenta. Rosolare carne con cipolla, aggiungere salsa 20 min. Servire sulla polenta.",kcal:490,prot:28,carb:54,fat:16,t:50},
{id:59,name:"Poké di riso con tonno/salmone",cat:"pranzo",veg:false,season:"summer",tags:["poke","riso","tonno","salmone","fresco","estate"],ing:[{n:"Riso basmati",a:80,u:"g",c:"cereali"},{n:"Tonno o salmone fresco",a:150,u:"g",c:"pesce"},{n:"Avocado",a:80,u:"g",c:"verdure"},{n:"Cetriolo",a:80,u:"g",c:"verdure"},{n:"Carota",a:60,u:"g",c:"verdure"},{n:"Salsa di soia",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere il riso. Tagliare il pesce a cubetti, marinare con soia. Assemblare la bowl con tutti gli ingredienti.",kcal:490,prot:32,carb:54,fat:16,t:25},
{id:60,name:"Insalata di riso con feta e ceci",cat:"pranzo",veg:true,season:"summer",tags:["insalata riso","feta","ceci","estate","vegetariano"],ing:[{n:"Riso",a:80,u:"g",c:"cereali"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Ceci cotti",a:100,u:"g",c:"legumi"},{n:"Verdure grigliate",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Cuocere e raffreddare il riso. Mescolare con feta, ceci e verdure grigliate. Condire.",kcal:450,prot:16,carb:60,fat:16,t:30},
{id:61,name:"Noodles wok con gamberi e verdure",cat:"pranzo",veg:false,season:"all",tags:["noodles","wok","gamberi","soia","asiatico"],ing:[{n:"Noodles di riso",a:80,u:"g",c:"cereali"},{n:"Gamberi",a:150,u:"g",c:"pesce"},{n:"Zucchine",a:80,u:"g",c:"verdure"},{n:"Carote",a:80,u:"g",c:"verdure"},{n:"Germogli di soia",a:60,u:"g",c:"verdure"},{n:"Salsa di soia",a:20,u:"ml",c:"condimenti"}],proc:"Cuocere i noodles. In wok bollente saltare gamberi e verdure 3-4 min. Aggiungere noodles e salsa di soia.",kcal:420,prot:22,carb:56,fat:10,t:20},
{id:70,name:"Burrito di carne macinata e verdure",cat:"cena",veg:false,season:"all",tags:["burrito","carne macinata","verdure","spezie"],ing:[{n:"Tortilla",a:60,u:"g",c:"cereali"},{n:"Carne macinata",a:150,u:"g",c:"pesce"},{n:"Peperoni",a:100,u:"g",c:"verdure"},{n:"Cipolla",a:50,u:"g",c:"verdure"},{n:"Salsa di pomodoro",a:80,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Rosolare carne con cipolla e peperoni. Aggiungere salsa. Farcire la tortilla.",kcal:450,prot:28,carb:40,fat:16,t:25},
{id:71,name:"Burrito di pollo e verdure",cat:"cena",veg:false,season:"all",tags:["burrito","pollo","verdure","spezie"],ing:[{n:"Tortilla",a:60,u:"g",c:"cereali"},{n:"Petto di pollo",a:150,u:"g",c:"pesce"},{n:"Peperoni",a:100,u:"g",c:"verdure"},{n:"Cipolla",a:50,u:"g",c:"verdure"},{n:"Spezie miste",a:3,u:"g",c:"condimenti"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Cuocere pollo a dadini con cipolla, peperoni e spezie. Farcire la tortilla.",kcal:420,prot:32,carb:38,fat:12,t:20},
{id:72,name:"Involtini di salmone affumicato e rucola",cat:"cena",veg:false,season:"all",tags:["salmone affumicato","philadelphia","rucola","light"],ing:[{n:"Salmone affumicato",a:150,u:"g",c:"pesce"},{n:"Philadelphia light",a:80,u:"g",c:"latticini"},{n:"Rucola",a:40,u:"g",c:"verdure"},{n:"Patate lesse",a:150,u:"g",c:"verdure"}],proc:"Stendere salmone, spalmare philadelphia, aggiungere rucola e arrotolare. Servire con patate e verdure.",kcal:360,prot:30,carb:22,fat:18,t:15},
{id:73,name:"Spiedini di salmone marinato con patate",cat:"cena",veg:false,season:"all",tags:["salmone","spiedini","limone","patate","omega3"],ing:[{n:"Salmone",a:200,u:"g",c:"pesce"},{n:"Patate",a:200,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"},{n:"Limone",a:30,u:"ml",c:"frutta"},{n:"Rosmarino",a:3,u:"g",c:"condimenti"}],proc:"Marinare salmone a cubetti con olio e limone per 1 ora. Infilzare sugli spiedini. Cuocere al forno con patate per 25-30 min.",kcal:480,prot:36,carb:30,fat:22,t:40},
{id:74,name:"Piadina con zucchine e ricotta",cat:"cena",veg:true,season:"all",tags:["piadina","sfoglia","zucchine","ricotta","vegetariano"],ing:[{n:"Piadina integrale",a:100,u:"g",c:"cereali"},{n:"Ricotta",a:100,u:"g",c:"latticini"},{n:"Zucchine",a:150,u:"g",c:"verdure"},{n:"Menta",a:3,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Grigliare le zucchine. Mescolare ricotta con menta. Scaldare la piadina, spalmare ricotta e aggiungere zucchine.",kcal:400,prot:18,carb:46,fat:15,t:15},
{id:75,name:"Spiedini di pollo alle spezie con patate",cat:"cena",veg:false,season:"all",tags:["pollo","spiedini","spezie","patate","forno"],ing:[{n:"Petto di pollo",a:200,u:"g",c:"pesce"},{n:"Patate",a:200,u:"g",c:"verdure"},{n:"Paprika",a:3,u:"g",c:"condimenti"},{n:"Verdure a scelta",a:100,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Marinare pollo con spezie. Infilzare sugli spiedini. Cuocere in forno a 200°C con patate e verdure per 25-30 min.",kcal:400,prot:38,carb:28,fat:12,t:35},
{id:76,name:"Strisce di pollo panate al forno",cat:"cena",veg:false,season:"all",tags:["pollo","pangrattato","forno","zucchine"],ing:[{n:"Petto di pollo",a:200,u:"g",c:"pesce"},{n:"Pangrattato",a:30,u:"g",c:"cereali"},{n:"Zucchine",a:150,u:"g",c:"verdure"},{n:"Uovo",a:60,u:"g",c:"altro"},{n:"Paprika",a:2,u:"g",c:"condimenti"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Tagliare il pollo a strisce, passare in uovo e pangrattato speziato. Cuocere in forno a 200°C per 20 min con zucchine.",kcal:390,prot:40,carb:22,fat:14,t:30},
{id:77,name:"Tartare di ricciola con pomodorini e olive",cat:"cena",veg:false,season:"summer",tags:["tartare","ricciola","pomodorini","olive","crudo"],ing:[{n:"Ricciola fresca",a:200,u:"g",c:"pesce"},{n:"Pomodorini",a:100,u:"g",c:"verdure"},{n:"Olive nere",a:40,u:"g",c:"verdure"},{n:"Limone",a:20,u:"ml",c:"frutta"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Tagliare la ricciola a cubetti piccoli. Marinare con limone, olio e sale 30 min. Servire con pomodorini e olive.",kcal:300,prot:34,carb:6,fat:16,t:35},
{id:78,name:"Panino con pesce spada e melanzane",cat:"cena",veg:false,season:"summer",tags:["panino","pesce spada","melanzane","grigliate"],ing:[{n:"Pane casereccio",a:80,u:"g",c:"cereali"},{n:"Pesce spada",a:150,u:"g",c:"pesce"},{n:"Melanzane",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Grigliare melanzane e pesce spada. Condire con olio e limone. Farcire il pane.",kcal:410,prot:28,carb:38,fat:14,t:20},
{id:79,name:"Polpo con patate bollite",cat:"cena",veg:false,season:"summer",tags:["polpo","patate","aglio","limone","mare"],ing:[{n:"Polpo pulito",a:300,u:"g",c:"pesce"},{n:"Patate",a:200,u:"g",c:"verdure"},{n:"Aglio",a:5,u:"g",c:"verdure"},{n:"Olio EVO",a:20,u:"ml",c:"condimenti"},{n:"Limone",a:20,u:"ml",c:"frutta"}],proc:"Bollire il polpo 40-50 min. Lessare le patate. Condire entrambi con aglio, olio e limone.",kcal:380,prot:32,carb:28,fat:12,t:60},
{id:80,name:"Burger di broccoli e feta",cat:"cena",veg:true,season:"all",tags:["broccoli","feta","burger","vegetariano"],ing:[{n:"Broccoli",a:300,u:"g",c:"verdure"},{n:"Feta",a:60,u:"g",c:"latticini"},{n:"Uovo",a:60,u:"g",c:"altro"},{n:"Farina",a:15,u:"g",c:"cereali"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Bollire e strizzare i broccoli. Tagliare finemente, mescolare con feta, uovo e farina. Formare burger e cuocere 2-3 min per lato.",kcal:310,prot:20,carb:18,fat:16,t:25},
{id:81,name:"Insalata cavolo viola e carote con ceci",cat:"cena",veg:true,season:"all",tags:["cavolo viola","carote","ceci","ricotta","julienne","vegetariano"],ing:[{n:"Cavolo viola",a:150,u:"g",c:"verdure"},{n:"Carote",a:100,u:"g",c:"verdure"},{n:"Ceci cotti",a:150,u:"g",c:"legumi"},{n:"Ricotta",a:80,u:"g",c:"latticini"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Tagliare cavolo e carote a julienne. Mescolare con ceci e ricotta. Condire con olio e limone.",kcal:320,prot:16,carb:28,fat:16,t:15},
{id:82,name:"Pesce spada con pomodorini e melanzane",cat:"cena",veg:false,season:"summer",tags:["pesce spada","pomodorini","melanzane","olive"],ing:[{n:"Pesce spada",a:200,u:"g",c:"pesce"},{n:"Pomodorini",a:150,u:"g",c:"verdure"},{n:"Melanzane",a:150,u:"g",c:"verdure"},{n:"Olive nere",a:40,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Rosolare melanzane, aggiungere pomodorini e olive. Aggiungere pesce spada e cuocere 8-10 min.",kcal:370,prot:38,carb:10,fat:18,t:25},
{id:83,name:"Uova alla passata di pomodoro",cat:"cena",veg:true,season:"all",tags:["uova","pomodoro","vegetariano","veloce","economico"],ing:[{n:"Uova",a:180,u:"g",c:"altro"},{n:"Passata di pomodoro",a:250,u:"g",c:"verdure"},{n:"Aglio",a:5,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Soffriggere aglio, aggiungere passata 10 min. Aprire le uova nel sugo, coprire e cuocere 5-6 min.",kcal:320,prot:22,carb:12,fat:20,t:20},
{id:84,name:"Bocconcini di pollo al forno con peperoni",cat:"cena",veg:false,season:"all",tags:["pollo","peperoni","forno","verdure","patate"],ing:[{n:"Petto di pollo",a:200,u:"g",c:"pesce"},{n:"Peperoni misti",a:200,u:"g",c:"verdure"},{n:"Patate",a:150,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"},{n:"Origano",a:2,u:"g",c:"condimenti"}],proc:"Tagliare tutto a bocconcini, condire con olio e origano. Cuocere in forno a 200°C per 30-35 min.",kcal:380,prot:36,carb:26,fat:14,t:40},
{id:85,name:"Tartare di carne con verdure e patate",cat:"cena",veg:false,season:"all",tags:["tartare","carne","patate"],ing:[{n:"Carne bovina macinata fine",a:150,u:"g",c:"pesce"},{n:"Patate lesse",a:150,u:"g",c:"verdure"},{n:"Verdure miste a crudo",a:100,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Condire la carne fresca con olio, limone, sale e pepe. Servire con patate lesse e verdure crude.",kcal:420,prot:28,carb:28,fat:18,t:15},
{id:86,name:"Insalata di melone, feta e cetrioli",cat:"cena",veg:true,season:"summer",tags:["melone","feta","cetriolo","cipolla rossa","estate","veloce"],ing:[{n:"Melone",a:200,u:"g",c:"frutta"},{n:"Feta",a:80,u:"g",c:"latticini"},{n:"Cetriolo",a:150,u:"g",c:"verdure"},{n:"Cipolla rossa",a:40,u:"g",c:"verdure"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Tagliare melone e cetriolo a pezzi. Aggiungere feta sbriciolata e cipolla. Condire.",kcal:280,prot:10,carb:26,fat:14,t:10},
{id:87,name:"Insalata di ceci con pomodori e verdure",cat:"cena",veg:true,season:"all",tags:["ceci","pomodori","cetriolo","peperoni","vegano"],ing:[{n:"Ceci cotti",a:200,u:"g",c:"legumi"},{n:"Pomodori",a:150,u:"g",c:"verdure"},{n:"Cetriolo",a:100,u:"g",c:"verdure"},{n:"Peperoni",a:80,u:"g",c:"verdure"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Tagliare tutte le verdure a cubetti. Mescolare con ceci, condire con limone e olio.",kcal:330,prot:14,carb:42,fat:11,t:10},
{id:88,name:"Bietole, fagioli e patate",cat:"cena",veg:true,season:"autumn",tags:["bietole","fagioli","patate","vegetariano","rustico"],ing:[{n:"Bietole",a:200,u:"g",c:"verdure"},{n:"Fagioli cannellini",a:150,u:"g",c:"legumi"},{n:"Patate",a:200,u:"g",c:"verdure"},{n:"Olio EVO",a:20,u:"ml",c:"condimenti"}],proc:"Cuocere le patate a dadini. Aggiungere bietole e fagioli, cuocere 10 min. Condire.",kcal:290,prot:12,carb:42,fat:8,t:30},
{id:89,name:"Friarielli, fagioli e patate",cat:"cena",veg:true,season:"autumn",tags:["friarielli","fagioli","patate","vegetariano","napoletano"],ing:[{n:"Friarielli",a:200,u:"g",c:"verdure"},{n:"Fagioli borlotti",a:150,u:"g",c:"legumi"},{n:"Patate",a:200,u:"g",c:"verdure"},{n:"Aglio",a:5,u:"g",c:"verdure"},{n:"Olio EVO",a:20,u:"ml",c:"condimenti"}],proc:"Rosolare aglio, aggiungere friarielli 5 min. Aggiungere patate a dadini e fagioli, cuocere 15 min.",kcal:300,prot:12,carb:44,fat:8,t:30},
{id:90,name:"Parmigiana light al forno",cat:"cena",veg:true,season:"summer",tags:["parmigiana","melanzane","mozzarella light","forno","vegetariano"],ing:[{n:"Melanzane",a:400,u:"g",c:"verdure"},{n:"Passata di pomodoro",a:200,u:"g",c:"verdure"},{n:"Mozzarella light",a:100,u:"g",c:"latticini"},{n:"Parmigiano Reggiano",a:30,u:"g",c:"latticini"},{n:"Olio EVO",a:15,u:"ml",c:"condimenti"}],proc:"Grigliare le melanzane. Alternare strati con passata, mozzarella e parmigiano. Infornare a 180°C per 25-30 min.",kcal:320,prot:18,carb:16,fat:18,t:50},
{id:91,name:"Sformato di zucchine e ricotta",cat:"cena",veg:true,season:"summer",tags:["sformato","zucchine","ricotta","vegetariano","light"],ing:[{n:"Zucchine",a:400,u:"g",c:"verdure"},{n:"Ricotta",a:200,u:"g",c:"latticini"},{n:"Uova",a:60,u:"g",c:"altro"},{n:"Parmigiano Reggiano",a:30,u:"g",c:"latticini"},{n:"Olio EVO",a:10,u:"ml",c:"condimenti"}],proc:"Grigliare zucchine a fette. Alternare strati di zucchine e ricotta con parmigiano. Far riposare in frigo (estate) o infornare a 180°C per 20 min.",kcal:280,prot:16,carb:12,fat:18,t:30},
];

// ── WEEK UTILS ────────────────────────────────────────────────────────────
const getWkKey=d=>{const dt=new Date(d||Date.now());dt.setHours(0,0,0,0);dt.setDate(dt.getDate()+3-(dt.getDay()+6)%7);const w1=new Date(dt.getFullYear(),0,4);const wn=1+Math.round(((dt-w1)/864e5-3+(w1.getDay()+6)%7)/7);return`${dt.getFullYear()}-W${String(wn).padStart(2,'0')}`;};
const wkMon=wk=>{const[y,w]=wk.split('-W').map(Number);const j=new Date(y,0,4);const m=new Date(j);m.setDate(j.getDate()-(j.getDay()+6)%7+(w-1)*7);return m;};
const wkLabel=wk=>{const m=wkMon(wk);const s=new Date(m);s.setDate(m.getDate()+6);return`${m.getDate()}/${m.getMonth()+1} – ${s.getDate()}/${s.getMonth()+1}/${s.getFullYear()}`;};
const shiftWk=(wk,d)=>getWkKey(new Date(wkMon(wk).getTime()+d*7*864e5));
const calcTDEE=p=>{const b=10*p.weight+6.25*p.height-5*p.age+(p.sex==="M"?5:-161);return Math.round(b*(ACT.find(a=>a.k===p.activity)?.m||1.55))+(GOALS.find(g=>g.k===p.goal)?.adj||0);};
const calcTgt=p=>{const c=calcTDEE(p);return{kcal:c,prot:Math.round(c*.20/4),carb:Math.round(c*.50/4),fat:Math.round(c*.30/9)};};
const initWkMenu=()=>{const m={};DKEYS.forEach(d=>{m[d]={};MEALS.forEach(mt=>{m[d][mt.k]=null;});});return m;};
const getShop=(wm,db)=>{
  const items={};
  DKEYS.forEach(d=>MEALS.forEach(mt=>{
    const e=wm?.[d]?.[mt.k];if(!e?.rid)return;
    const r=db.find(x=>x.id===e.rid);if(!r)return;
    const p=e.shopP||1;
    r.ing.forEach(ing=>{
      const k=ing.n.toLowerCase();
      if(ing.u==="q.b."){if(!items[k])items[k]={name:ing.n,amount:0,unit:"q.b.",cat:ing.c||"altro"};}
      else{if(items[k])items[k].amount+=ing.a*p;else items[k]={name:ing.n,amount:ing.a*p,unit:ing.u,cat:ing.c||"altro"};}
    });
  }));
  return Object.values(items).sort((a,b)=>a.name.localeCompare(b.name));
};
const dayMacros=(wm,db,day)=>{let t={kcal:0,prot:0,carb:0,fat:0};MEALS.forEach(mt=>{const e=wm?.[day]?.[mt.k];if(!e)return;if(e.rid){const r=db.find(x=>x.id===e.rid);if(!r)return;t.kcal+=r.kcal;t.prot+=r.prot;t.carb+=r.carb;t.fat+=r.fat;}else if(e.fid){t.kcal+=e.kcal||0;t.prot+=e.prot||0;t.carb+=e.carb||0;t.fat+=e.fat||0;}});return t;};
const srch=(db,q,cat,veg)=>{let r=db;if(cat&&cat!=="all")r=r.filter(x=>x.cat===cat);if(veg)r=r.filter(x=>x.veg===true);if(!q.trim())return r;const lq=q.toLowerCase();return r.filter(x=>x.name.toLowerCase().includes(lq)||x.tags.some(t=>t.includes(lq))||x.ing.some(i=>i.n.toLowerCase().includes(lq)));};
const seEmo=s=>({all:"🌿",spring:"🌸",summer:"☀️",autumn:"🍂",winter:"❄️"}[s]||"🌿");
const shareWA=t=>window.open(`https://wa.me/?text=${encodeURIComponent(t)}`,'_blank');
const menuTxt=(wm,db,wk)=>{let t=`🫒 Menu Settimana ${wkLabel(wk)}\n\n`;DKEYS.forEach((d,i)=>{t+=`📅 ${DAYS[i]}\n`;MEALS.forEach(mt=>{const e=wm?.[d]?.[mt.k];if(!e?.rid)return;const r=db.find(x=>x.id===e.rid);if(!r)return;t+=`  ${mt.i} ${mt.l}: ${r.name} (${r.kcal}kcal)\n`;});t+="\n";});return t;};
const shopTxt=(wm,db)=>{const it=getShop(wm,db);let t="🛒 Lista della Spesa MedMenu\n\n";CATS.forEach(c=>{const g=it.filter(i=>i.cat===c.k);if(!g.length)return;t+=`${c.l}\n`;g.forEach(i=>{t+=`☐ ${i.name}: ${i.unit==="q.b."?"q.b.":Math.round(i.amount)+i.unit}\n`;});t+="\n";});return t;};

const CSS=`*{box-sizing:border-box;margin:0;padding:0;}body{background:#FFF8F0;font-family:system-ui,sans-serif;}.app{max-width:430px;margin:0 auto;min-height:100vh;background:#FFF8F0;}.hdr{background:linear-gradient(135deg,#E07340,#F4A261);padding:52px 20px 20px;color:#fff;}.hdr h1{font-size:22px;font-weight:800;}.hdr p{font-size:12px;opacity:.85;margin-top:2px;}.tbar{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#fff;border-top:1px solid #EEE5DB;display:flex;z-index:100;box-shadow:0 -3px 16px rgba(0,0,0,.09);}.tab{flex:1;padding:10px 2px 8px;border:none;background:none;cursor:pointer;font-size:9px;font-weight:600;color:#999;display:flex;flex-direction:column;align-items:center;gap:2px;}.tab.on{color:#E07340;}.tab .ic{font-size:19px;}.cnt{padding:0 0 84px;}.cd{background:#fff;border-radius:16px;padding:16px;margin:0 12px 10px;box-shadow:0 2px 10px rgba(0,0,0,.07);}.btn{border:none;border-radius:12px;cursor:pointer;font-weight:700;font-family:inherit;}.bp{background:#E07340;color:#fff;padding:13px 20px;font-size:15px;width:100%;}.bp:disabled{opacity:.4;}.bs{background:#FFF0E8;color:#E07340;padding:6px 10px;font-size:12px;border-radius:8px;}.bg{background:#E8F4F0;color:#2A9D8F;padding:6px 10px;font-size:12px;border-radius:8px;}.inp{width:100%;padding:12px 14px;border-radius:12px;border:2px solid #E8E0D8;font-size:14px;background:#fff;outline:none;font-family:inherit;}.inp:focus{border-color:#E07340;}.lbl{font-weight:700;color:#264653;margin-bottom:6px;display:block;font-size:13px;}.chip{padding:3px 8px;border-radius:20px;font-size:11px;font-weight:700;}.ov{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:200;overflow-y:auto;}.mod{background:#fff;border-radius:22px 22px 0 0;margin-top:60px;min-height:calc(100vh - 60px);padding:20px;}.mhd{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}.xb{width:34px;height:34px;border-radius:17px;background:#F5F0E8;border:none;cursor:pointer;font-size:18px;}.pb{height:8px;border-radius:4px;background:#F0E8DF;overflow:hidden;}.pf{height:100%;border-radius:4px;}.sr{display:flex;overflow-x:auto;gap:6px;padding:6px 0;scrollbar-width:none;}`;

// ── SETUP ─────────────────────────────────────────────────────────────────
function Setup({onDone}){
  const[s,setS]=useState(0);
  const[f,setF]=useState({name:"",sex:"M",age:"",height:"",weight:"",activity:"moderate",goal:"maintain"});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const ok=[f.name.trim(),f.age>0&&f.height>0&&f.weight>0,true];
  return(<div className="app"><style>{CSS}</style>
    <div style={{background:"linear-gradient(135deg,#E07340,#F4A261)",padding:"36px 24px 24px",color:"#fff",textAlign:"center"}}>
      <div style={{fontSize:48}}>🫒</div>
      <h1 style={{fontSize:24,fontWeight:800,margin:"8px 0 4px"}}>MedMenu</h1>
      <p style={{opacity:.9,fontSize:13}}>La tua guida alla dieta mediterranea</p>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:14}}>
        {[0,1,2].map(i=><div key={i} style={{height:6,borderRadius:3,background:i<=s?"#fff":"rgba(255,255,255,.35)",width:i===s?28:8,transition:"all .3s"}}/>)}
      </div>
    </div>
    <div style={{padding:"20px"}}>
      {s===0&&<><h2 style={{color:"#264653",marginBottom:14}}>👋 Benvenuto!</h2>
        <div style={{marginBottom:12}}><label className="lbl">Il tuo nome</label><input className="inp" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Come ti chiami?"/></div>
        <label className="lbl">Sesso biologico</label>
        <div style={{display:"flex",gap:10}}>
          {[{v:"M",l:"👨 Maschio"},{v:"F",l:"👩 Femmina"}].map(x=><button key={x.v} onClick={()=>set("sex",x.v)} className="btn" style={{flex:1,padding:"12px",fontSize:14,background:f.sex===x.v?"#E07340":"#fff",color:f.sex===x.v?"#fff":"#264653",border:"2px solid "+(f.sex===x.v?"#E07340":"#E8E0D8"),borderRadius:12}}>{x.l}</button>)}
        </div>
      </>}
      {s===1&&<><h2 style={{color:"#264653",marginBottom:14}}>📏 Dati fisici</h2>
        {[{k:"age",l:"Età",u:"anni"},{k:"height",l:"Altezza",u:"cm"},{k:"weight",l:"Peso",u:"kg"}].map(fd=>(
          <div key={fd.k} style={{marginBottom:12}}><label className="lbl">{fd.l} ({fd.u})</label><input className="inp" type="number" value={f[fd.k]} onChange={e=>set(fd.k,Number(e.target.value))}/></div>
        ))}
        <label className="lbl">Attività fisica</label>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {ACT.map(a=><button key={a.k} onClick={()=>set("activity",a.k)} className="btn" style={{padding:"10px 14px",textAlign:"left",background:f.activity===a.k?"#E07340":"#fff",color:f.activity===a.k?"#fff":"#264653",border:"2px solid "+(f.activity===a.k?"#E07340":"#E8E0D8"),borderRadius:12,fontSize:13}}>{a.l}</button>)}
        </div>
      </>}
      {s===2&&<><h2 style={{color:"#264653",marginBottom:14}}>🎯 Obiettivo</h2>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {GOALS.map(g=><button key={g.k} onClick={()=>set("goal",g.k)} className="btn" style={{padding:"14px 16px",textAlign:"left",background:f.goal===g.k?"#E07340":"#fff",color:f.goal===g.k?"#fff":"#264653",border:"2px solid "+(f.goal===g.k?"#E07340":"#E8E0D8"),borderRadius:12,fontSize:14}}>{g.l}</button>)}
        </div>
      </>}
    </div>
    <div style={{padding:"0 20px 28px",display:"flex",gap:10}}>
      {s>0&&<button onClick={()=>setS(x=>x-1)} className="btn" style={{flex:1,padding:"13px",border:"2px solid #E07340",color:"#E07340",background:"transparent"}}>← Indietro</button>}
      <button onClick={()=>s<2?ok[s]&&setS(x=>x+1):onDone(f)} disabled={!ok[s]} className="btn bp" style={{flex:2}}>{s<2?"Avanti →":"Inizia! 🫒"}</button>
    </div>
  </div>);
}

// ── RECIPE CARD ───────────────────────────────────────────────────────────
function RCard({r,onSel}){
  const mc=MEALS.find(m=>m.k===r.cat)?.c||"#888";
  const ml=MEALS.find(m=>m.k===r.cat)?.l||r.cat;
  const mi=MEALS.find(m=>m.k===r.cat)?.i||"🍴";
  return(<div onClick={()=>onSel(r)} className="cd" style={{cursor:"pointer",border:"1px solid #F0E8DF"}}>
    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
      <div style={{width:44,height:44,borderRadius:12,background:mc+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{mi}</div>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,color:"#264653",fontSize:13,lineHeight:1.3,marginBottom:4}}>{r.name}</div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          <span className="chip" style={{background:mc+"22",color:mc}}>{ml}</span>
          <span className="chip" style={{background:"#F5F0E8",color:"#888"}}>⏱{r.t}m</span>
          {r.veg&&<span className="chip" style={{background:"#E8F4E8",color:"#2D8A2D"}}>🥦</span>}
          {r.custom&&<span className="chip" style={{background:"#E8F4F0",color:"#2A9D8F"}}>✏️</span>}
        </div>
      </div>
    </div>
    <div style={{display:"flex",borderTop:"1px solid #F5F0E8",paddingTop:8,marginTop:8}}>
      {[{l:"kcal",v:r.kcal,c:"#E07340"},{l:"prot",v:r.prot+"g",c:"#2A9D8F"},{l:"carb",v:r.carb+"g",c:"#E9A820"},{l:"grassi",v:r.fat+"g",c:"#9C6B9E"}].map(m=>(
        <div key={m.l} style={{flex:1,textAlign:"center"}}><div style={{fontWeight:800,color:m.c,fontSize:12}}>{m.v}</div><div style={{fontSize:10,color:"#999"}}>{m.l}</div></div>
      ))}
    </div>
  </div>);
}

// ── RECIPE MODAL ──────────────────────────────────────────────────────────
function RModal({recipe,onClose,onAdd,ratings,onRate}){
  const mc=MEALS.find(m=>m.k===recipe.cat)?.c||"#888";
  const ml=MEALS.find(m=>m.k===recipe.cat)?.l||recipe.cat;
  const[adding,setAdding]=useState(false);
  const[selD,setSelD]=useState(DKEYS[0]);
  const[selM,setSelM]=useState(recipe.cat);
  const[shopP,setShopP]=useState(1);
  const[editI,setEditI]=useState(false);
  const[cIng,setCIng]=useState(recipe.ing.map(i=>({...i,ca:i.a})));
  const rating=ratings?.[recipe.id]||0;
  const base=recipe.ing.reduce((s,i)=>s+(i.u!=="q.b."?i.a:0),1);
  const cur=cIng.reduce((s,i)=>s+(i.u!=="q.b."?i.ca:0),1);
  const ratio=cur/base;
  const adj=v=>Math.round(v*ratio);
  const setCA=(i,v)=>setCIng(p=>{const n=[...p];n[i]={...n[i],ca:Math.max(0,Number(v)||0)};return n;});
  return(<div className="ov" onClick={onClose}>
    <div className="mod" onClick={e=>e.stopPropagation()}>
      <div className="mhd">
        <span className="chip" style={{background:mc+"22",color:mc,padding:"5px 12px"}}>{ml}</span>
        <button className="xb" onClick={onClose}>×</button>
      </div>
      <h2 style={{color:"#264653",fontSize:17,lineHeight:1.3,marginBottom:8}}>{recipe.name}</h2>
      <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
        <span style={{background:"#F5F0E8",color:"#888",padding:"3px 8px",borderRadius:12,fontSize:11}}>⏱ {recipe.t} min</span>
        <span style={{background:"#F5F0E8",color:"#888",padding:"3px 8px",borderRadius:12,fontSize:11}}>{seEmo(recipe.season)} {SEASONS[recipe.season]}</span>
        {recipe.veg&&<span style={{background:"#E8F4E8",color:"#2D8A2D",padding:"3px 8px",borderRadius:12,fontSize:11}}>🥦 Vegetariano</span>}
        {ratio!==1&&<span style={{background:"#FFF0E8",color:"#E07340",padding:"3px 8px",borderRadius:12,fontSize:11}}>⚖️ mod.</span>}
      </div>
      <div style={{display:"flex",gap:2,marginBottom:12,alignItems:"center"}}>
        <span style={{fontSize:12,color:"#666",marginRight:4}}>Valutazione:</span>
        {[1,2,3,4,5].map(s=><span key={s} onClick={()=>onRate(recipe.id,s)} style={{fontSize:20,cursor:"pointer",opacity:s<=rating?1:.25}}>{s<=rating?"⭐":"☆"}</span>)}
      </div>
      <div style={{background:"#FFF8F0",borderRadius:12,padding:12,marginBottom:12}}>
        <div style={{fontWeight:700,color:"#264653",marginBottom:8,fontSize:12}}>📊 Macro — 1 porzione</div>
        <div style={{display:"flex",gap:6}}>
          {[{l:"Calorie",v:adj(recipe.kcal)+"kcal",c:"#E07340"},{l:"Proteine",v:adj(recipe.prot)+"g",c:"#2A9D8F"},{l:"Carboidrati",v:adj(recipe.carb)+"g",c:"#E9A820"},{l:"Grassi",v:adj(recipe.fat)+"g",c:"#9C6B9E"}].map(m=>(
            <div key={m.l} style={{flex:1,background:m.c+"11",borderRadius:10,padding:"8px 2px",textAlign:"center"}}>
              <div style={{fontWeight:800,color:m.c,fontSize:13}}>{m.v}</div>
              <div style={{fontSize:10,color:"#888",marginTop:2}}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontWeight:700,color:"#264653",fontSize:12}}>🛒 Ingredienti</div>
          <div style={{display:"flex",gap:5}}>
            {ratio!==1&&<button className="btn bs" onClick={()=>setCIng(recipe.ing.map(i=>({...i,ca:i.a})))}>↺</button>}
            <button className="btn bs" onClick={()=>setEditI(p=>!p)} style={{background:editI?"#E07340":"#FFF0E8",color:editI?"#fff":"#E07340"}}>{editI?"✓ Ok":"✏️ g"}</button>
          </div>
        </div>
        {cIng.map((ing,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #F5F0E8"}}>
            <span style={{color:"#264653",fontSize:13,flex:1}}>{ing.n}</span>
            {editI&&ing.u!=="q.b."?
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <button onClick={()=>setCA(i,ing.ca-5)} className="btn" style={{width:26,height:26,borderRadius:13,background:"#F5F0E8",color:"#264653",padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <input type="number" value={ing.ca} onChange={e=>setCA(i,e.target.value)} style={{width:50,textAlign:"center",padding:"3px",borderRadius:8,border:"2px solid #E07340",fontSize:13,fontWeight:700,outline:"none"}}/>
                <button onClick={()=>setCA(i,ing.ca+5)} className="btn" style={{width:26,height:26,borderRadius:13,background:"#E07340",color:"#fff",padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                <span style={{fontSize:12,color:"#888",minWidth:12}}>{ing.u}</span>
              </div>:
              <span style={{color:"#888",fontWeight:600,fontSize:13}}>{ing.u==="q.b."?"q.b.":ing.ca+ing.u}{ing.ca!==ing.a&&ing.u!=="q.b."&&<span style={{color:"#E07340",fontSize:10}}>(orig:{ing.a})</span>}</span>
            }
          </div>
        ))}
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontWeight:700,color:"#264653",marginBottom:6,fontSize:12}}>👨‍🍳 Preparazione</div>
        <p style={{color:"#555",fontSize:13,lineHeight:1.7}}>{recipe.proc}</p>
      </div>
      {!adding?<button className="btn bp" onClick={()=>setAdding(true)}>+ Aggiungi al menù</button>:
        <div style={{background:"#FFF8F0",borderRadius:12,padding:14}}>
          <div style={{fontWeight:700,color:"#264653",marginBottom:10,fontSize:13}}>Aggiungi al menù</div>
          <div style={{display:"flex",gap:10,marginBottom:10}}>
            <div style={{flex:1}}><label className="lbl" style={{fontSize:12}}>Giorno</label>
              <select className="inp" style={{fontSize:13}} value={selD} onChange={e=>setSelD(e.target.value)}>
                {DKEYS.map((d,i)=><option key={d} value={d}>{DAYS[i]}</option>)}
              </select>
            </div>
            <div style={{flex:1}}><label className="lbl" style={{fontSize:12}}>Pasto</label>
              <select className="inp" style={{fontSize:13}} value={selM} onChange={e=>setSelM(e.target.value)}>
                {MEALS.map(m=><option key={m.k} value={m.k}>{m.i} {m.l}</option>)}
              </select>
            </div>
          </div>
          <label className="lbl" style={{fontSize:12}}>Persone (per lista spesa)</label>
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {[1,2,3,4,5,6].map(n=><button key={n} onClick={()=>setShopP(n)} className="btn" style={{flex:1,height:36,background:shopP===n?"#E07340":"#fff",color:shopP===n?"#fff":"#264653",border:"2px solid "+(shopP===n?"#E07340":"#E8E0D8"),borderRadius:10,fontSize:13}}>{n}</button>)}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setAdding(false)} className="btn" style={{flex:1,padding:"11px",border:"2px solid #E8E0D8",color:"#888",background:"#fff",fontSize:13}}>Annulla</button>
            <button onClick={()=>{onAdd(selD,selM,recipe.id,shopP);setAdding(false);onClose();}} className="btn bp" style={{flex:2}}>✓ Aggiungi</button>
          </div>
        </div>
      }
    </div>
  </div>);
}

// ── SEARCH TAB ────────────────────────────────────────────────────────────
function SearchTab({db,onAddToMenu,ratings,onRate}){
  const[q,setQ]=useState("");
  const[cat,setCat]=useState("all");
  const[veg,setVeg]=useState(false);
  const[season,setSeason]=useState("all");
  const[sel,setSel]=useState(null);
  const res=srch(db,q,cat,veg).filter(r=>season==="all"||r.season===season||r.season==="all");
  return(<div>
    {sel&&<RModal recipe={sel} onClose={()=>setSel(null)} onAddToMenu={onAddToMenu} onAdd={onAddToMenu} ratings={ratings} onRate={onRate}/>}
    <div className="hdr"><h1>🔍 Ricette</h1><p>{db.length} ricette mediterranee</p></div>
    <div style={{padding:"10px 12px 0"}}>
      <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca per nome, ingrediente, categoria..."/>
      <div style={{background:"#fff",borderRadius:14,padding:"10px 12px",marginTop:8,boxShadow:"0 1px 6px rgba(0,0,0,.06)"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#aaa",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Categoria</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {[{k:"all",l:"Tutte"},{k:"colazione",l:"Colazione"},{k:"spuntino",l:"Spuntino"},{k:"pranzo",l:"Primo Piatto"},{k:"cena",l:"Secondo Piatto"}].map(c=>(
            <button key={c.k} onClick={()=>setCat(c.k)} className="btn" style={{padding:"5px 11px",background:cat===c.k?"#E07340":"#F5F0E8",color:cat===c.k?"#fff":"#264653",border:"none",borderRadius:20,fontSize:12,fontWeight:cat===c.k?700:500}}>{c.l}</button>
          ))}
        </div>
      </div>
      <div style={{background:"#fff",borderRadius:14,padding:"10px 12px",marginTop:8,marginBottom:6,boxShadow:"0 1px 6px rgba(0,0,0,.06)"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#aaa",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>Stagione e dieta</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
          {[{k:"all",l:"Tutte stagioni"},{k:"spring",l:"Primavera"},{k:"summer",l:"Estate"},{k:"autumn",l:"Autunno"},{k:"winter",l:"Inverno"}].map(s=>(
            <button key={s.k} onClick={()=>setSeason(s.k)} className="btn" style={{padding:"5px 11px",background:season===s.k?"#2A9D8F":"#F5F0E8",color:season===s.k?"#fff":"#264653",border:"none",borderRadius:20,fontSize:12,fontWeight:season===s.k?700:500}}>{s.l}</button>
          ))}
          <button onClick={()=>setVeg(p=>!p)} className="btn" style={{padding:"5px 11px",background:veg?"#2D8A2D":"#F5F0E8",color:veg?"#fff":"#264653",border:"none",borderRadius:20,fontSize:12,fontWeight:veg?700:500}}>Vegetariano</button>
        </div>
      </div>
    </div>
    <div className="cnt">
      {res.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:"#888"}}>Nessuna ricetta trovata 🔍</div>:
        res.map(r=><RCard key={r.id} r={r} onSel={setSel}/>)
      }
    </div>
  </div>);
}

// ── FOOD MODAL ────────────────────────────────────────────────────────────
function FoodModal({mealLabel,onClose,onAdd}){
  const[q,setQ]=useState("");
  const[results,setResults]=useState([]);
  const[sel,setSel]=useState(null);
  const[amt,setAmt]=useState(100);
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const timerRef=useState(null);

  const search=async(query)=>{
    if(!query.trim()){setResults([]);setSel(null);return;}
    setLoading(true);setErr("");setSel(null);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{role:"user",content:`Dammi i valori nutrizionali per 100g dei seguenti alimenti italiani che corrispondono alla ricerca: "${query}". Rispondi SOLO con un array JSON, nessun testo aggiuntivo, nessun markdown. Formato: [{"name":"nome alimento","kcal":000,"prot":0.0,"carb":0.0,"fat":0.0}]. Restituisci da 1 a 6 alimenti pertinenti. I valori devono essere numeri.`}]
        })
      });
      const data=await res.json();
      const txt=data.content?.[0]?.text||"[]";
      const clean=txt.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setResults(parsed.map((f,i)=>({...f,id:"ai_"+i})));
    }catch(e){setErr("Errore nella ricerca. Riprova.");}
    setLoading(false);
  };

  const onType=e=>{
    const v=e.target.value;setQ(v);
    if(timerRef[0])clearTimeout(timerRef[0]);
    timerRef[0]=setTimeout(()=>search(v),600);
  };

  const calc=f=>({kcal:Math.round(f.kcal*amt/100),prot:Math.round(f.prot*amt/100),carb:Math.round(f.carb*amt/100),fat:Math.round(f.fat*amt/100)});
  const macros=sel?calc(sel):null;

  return(<div className="ov" onClick={onClose}>
    <div className="mod" onClick={e=>e.stopPropagation()}>
      <div className="mhd"><h3 style={{color:"#264653"}}>🥗 Alimento — {mealLabel}</h3><button className="xb" onClick={onClose}>×</button></div>
      <input className="inp" value={q} onChange={onType} placeholder="Scrivi qualsiasi alimento (es. bresaola, kefir, quinoa...)"/>
      <div style={{minHeight:60,margin:"10px 0",borderRadius:12,border:"1px solid #F0E8DF",overflow:"hidden"}}>
        {loading&&<div style={{padding:"18px",textAlign:"center",color:"#E07340",fontSize:13}}>Ricerca in corso...</div>}
        {!loading&&err&&<div style={{padding:"14px",textAlign:"center",color:"#e55",fontSize:13}}>{err}</div>}
        {!loading&&!err&&q&&results.length===0&&<div style={{padding:"14px",textAlign:"center",color:"#CCC",fontSize:13}}>Nessun risultato</div>}
        {!loading&&!q&&<div style={{padding:"14px",textAlign:"center",color:"#CCC",fontSize:13}}>Inizia a digitare per cercare qualsiasi alimento</div>}
        {!loading&&results.map(f=>(
          <div key={f.id} onClick={()=>setSel(f)} style={{padding:"10px 14px",borderBottom:"1px solid #F5F0E8",cursor:"pointer",background:sel?.id===f.id?"#FFF0E8":"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:sel?.id===f.id?700:400,color:"#264653",fontSize:13}}>{f.name}</span>
            <span style={{fontSize:11,color:"#888"}}>{f.kcal} kcal/100g</span>
          </div>
        ))}
      </div>
      {sel&&(<>
        <label className="lbl" style={{fontSize:12}}>Quantità (g)</label>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <button onClick={()=>setAmt(a=>Math.max(10,a-10))} className="btn" style={{width:36,height:36,borderRadius:18,background:"#F5F0E8",color:"#264653",fontSize:18,padding:0,display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
          <input type="number" value={amt} onChange={e=>setAmt(Math.max(10,+e.target.value||10))} style={{flex:1,textAlign:"center",padding:"8px",borderRadius:10,border:"2px solid #E07340",fontSize:16,fontWeight:700,outline:"none"}}/>
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
      </>)}
    </div>
  </div>);
}


// ── MENU TAB ──────────────────────────────────────────────────────────────
function MenuTab({curWk,wkMenus,db,profile,onWkChange,onUpdate,onSaveWk,savedMenus,onLoadMenu,onDelSaved,ratings,onRate}){
  const[selDay,setSelDay]=useState(0);
  const[selR,setSelR]=useState(null);
  const[foodMeal,setFoodMeal]=useState(null);
  const[saveName,setSaveName]=useState("");
  const[showSave,setShowSave]=useState(false);
  const[showSaved,setShowSaved]=useState(false);
  const curMenu=wkMenus[curWk]||initWkMenu();
  const tgt=calcTgt(profile);
  const dm=dayMacros(curMenu,db,DKEYS[selDay]);
  const pct=v=>Math.min(100,Math.round(v/tgt.kcal*100));
  return(<div>
    {selR&&<RModal recipe={selR} onClose={()=>setSelR(null)} onAdd={onUpdate} ratings={ratings} onRate={onRate}/>}
    {foodMeal&&<FoodModal mealLabel={MEALS.find(m=>m.k===foodMeal)?.ml||foodMeal} onClose={()=>setFoodMeal(null)} onAdd={(food)=>{onUpdate(DKEYS[selDay],foodMeal,null,null,food);setFoodMeal(null);}}/>}
    <div className="hdr">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <h1>📅 Menù</h1>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>shareWA(menuTxt(curMenu,db,curWk))} className="btn bs" style={{fontSize:11}}>📤 WA</button>
          <button onClick={()=>setShowSave(p=>!p)} className="btn bs" style={{fontSize:11}}>💾 Salva</button>
          <button onClick={()=>setShowSaved(p=>!p)} className="btn bs" style={{fontSize:11}}>📁 {savedMenus.length}</button>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>onWkChange(shiftWk(curWk,-1))} className="btn" style={{background:"rgba(255,255,255,.2)",color:"#fff",padding:"4px 10px",borderRadius:8}}>◀</button>
        <span style={{flex:1,textAlign:"center",fontSize:13,fontWeight:700}}>{wkLabel(curWk)}</span>
        <button onClick={()=>onWkChange(shiftWk(curWk,1))} className="btn" style={{background:"rgba(255,255,255,.2)",color:"#fff",padding:"4px 10px",borderRadius:8}}>▶</button>
      </div>
      {showSave&&<div style={{marginTop:8,display:"flex",gap:6}}>
        <input value={saveName} onChange={e=>setSaveName(e.target.value)} placeholder="Nome per questo menù..." style={{flex:1,padding:"8px 12px",borderRadius:10,border:"none",fontSize:13}}/>
        <button onClick={()=>{if(saveName.trim()){onSaveWk(saveName.trim());setSaveName("");setShowSave(false);}}} className="btn" style={{background:"#fff",color:"#E07340",padding:"8px 12px",borderRadius:10,fontSize:13,fontWeight:700}}>Salva</button>
      </div>}
    </div>
    {showSaved&&savedMenus.length>0&&<div className="cd">
      <div style={{fontWeight:700,color:"#264653",marginBottom:8,fontSize:13}}>📁 Menù salvati</div>
      {savedMenus.map(sm=>(
        <div key={sm.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #F5F0E8"}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,color:"#264653",fontSize:13}}>{sm.name}</div>
            <div style={{fontSize:11,color:"#888"}}>{wkLabel(sm.wk)}</div>
          </div>
          <button onClick={()=>{onLoadMenu(sm);setShowSaved(false);}} className="btn bg" style={{fontSize:11}}>Carica</button>
          <button onClick={()=>onDelSaved(sm.id)} className="btn bs" style={{fontSize:11}}>✕</button>
        </div>
      ))}
    </div>}
    <div className="sr" style={{padding:"10px 12px"}}>
      {DAYS.map((d,i)=>{
        const hasFood=MEALS.some(m=>curMenu[DKEYS[i]]?.[m.k]);
        const dm2=dayMacros(curMenu,db,DKEYS[i]);
        return(<button key={d} onClick={()=>setSelDay(i)} className="btn" style={{flexShrink:0,padding:"8px 10px",background:selDay===i?"#E07340":"#fff",color:selDay===i?"#fff":"#264653",border:"2px solid "+(selDay===i?"#E07340":"#E8E0D8"),borderRadius:14,fontSize:11,display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
          <span style={{fontWeight:800}}>{d.slice(0,3)}</span>
          {hasFood&&<span style={{fontSize:9,opacity:.8}}>{dm2.kcal}kcal</span>}
        </button>);
      })}
    </div>
    <div className="cd">
      <div style={{fontWeight:700,color:"#264653",marginBottom:10,fontSize:13}}>📊 {DAYS[selDay]} — Riepilogo</div>
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
        const e=curMenu[DKEYS[selDay]]?.[mt.k];
        const r=e?.rid?db.find(x=>x.id===e.rid):null;
        const isFood=!r&&e?.fid;
        const hasEntry=r||isFood;
        return(<div key={mt.k} className="cd" style={{border:"1px solid #F0E8DF"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:hasEntry?8:0}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:18}}>{mt.i}</span>
              <span style={{fontWeight:700,color:"#264653",fontSize:13}}>{mt.ml||mt.l}</span>
            </div>
            <div style={{display:"flex",gap:5}}>
              {!hasEntry&&<button className="btn bg" style={{fontSize:10,padding:"4px 8px"}} onClick={()=>setFoodMeal(mt.k)}>🥗 Alimento</button>}
              {hasEntry&&<button className="btn bs" style={{fontSize:11}} onClick={()=>onUpdate(DKEYS[selDay],mt.k,null,null)}>✕</button>}
            </div>
          </div>
          {r&&<div onClick={()=>setSelR(r)} style={{cursor:"pointer"}}>
            <div style={{fontWeight:600,color:"#264653",fontSize:13,marginBottom:6}}>{r.name}</div>
            <div style={{display:"flex"}}>
              {[{l:"kcal",v:r.kcal,c:"#E07340"},{l:"prot",v:r.prot+"g",c:"#2A9D8F"},{l:"carb",v:r.carb+"g",c:"#E9A820"},{l:"grassi",v:r.fat+"g",c:"#9C6B9E"}].map(m=>(
                <div key={m.l} style={{flex:1,textAlign:"center"}}><div style={{fontWeight:800,color:m.c,fontSize:12}}>{m.v}</div><div style={{fontSize:10,color:"#999"}}>{m.l}</div></div>
              ))}
            </div>
            {e.shopP>1&&<div style={{fontSize:11,color:"#888",marginTop:4}}>🛒 Spesa per {e.shopP} persone</div>}
          </div>}
          {isFood&&<div>
            <div style={{fontWeight:600,color:"#264653",fontSize:13,marginBottom:6}}>{e.name}</div>
            <div style={{display:"flex"}}>
              {[{l:"kcal",v:e.kcal,c:"#E07340"},{l:"prot",v:e.prot+"g",c:"#2A9D8F"},{l:"carb",v:e.carb+"g",c:"#E9A820"},{l:"grassi",v:e.fat+"g",c:"#9C6B9E"}].map(m=>(
                <div key={m.l} style={{flex:1,textAlign:"center"}}><div style={{fontWeight:800,color:m.c,fontSize:12}}>{m.v}</div><div style={{fontSize:10,color:"#999"}}>{m.l}</div></div>
              ))}
            </div>
          </div>}
          {!hasEntry&&<div style={{color:"#CCC",fontSize:12,fontStyle:"italic",paddingTop:4}}>Facoltativo — aggiungi ricetta o alimento</div>}
        </div>);
      })}
    </div>
  </div>);
}

// ── SHOP TAB ──────────────────────────────────────────────────────────────
function ShopTab({curWk,curMenu,db}){
  const[checked,setChecked]=useState({});
  const items=getShop(curMenu,db);
  const toggle=k=>setChecked(p=>({...p,[k]:!p[k]}));
  const grouped={};
  items.forEach(it=>{const c=it.cat||"altro";if(!grouped[c])grouped[c]=[];grouped[c].push(it);});
  const done=items.filter(it=>checked[it.name.toLowerCase()]).length;
  return(<div>
    <div className="hdr">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><h1>🛒 Lista Spesa</h1><p>{done}/{items.length} spuntati</p></div>
        <button onClick={()=>shareWA(shopTxt(curMenu,db))} className="btn bs" style={{fontSize:11}}>📤 WhatsApp</button>
      </div>
    </div>
    {items.length===0?<div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:48,marginBottom:12}}>🛒</div>
      <div style={{color:"#888",fontSize:14}}>Aggiungi ricette al menù per generare la lista</div>
    </div>:
    <div className="cnt" style={{padding:"8px 0 84px"}}>
      {done>0&&<div style={{margin:"4px 12px 6px",textAlign:"right"}}><button className="btn bs" onClick={()=>setChecked({})}>Reset</button></div>}
      {CATS.filter(c=>grouped[c.k]).map(c=>(
        <div key={c.k}>
          <div style={{padding:"8px 16px",fontSize:11,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:1}}>{c.l}</div>
          {grouped[c.k].map(it=>{
            const k=it.name.toLowerCase();
            return(<div key={k} onClick={()=>toggle(k)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:checked[k]?"#F9F9F9":"#fff",borderBottom:"1px solid #F5F0E8",cursor:"pointer",opacity:checked[k]?.5:1}}>
              <div style={{width:22,height:22,borderRadius:11,border:"2px solid "+(checked[k]?"#2A9D8F":"#DDD"),background:checked[k]?"#2A9D8F":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {checked[k]&&<span style={{color:"#fff",fontSize:13}}>✓</span>}
              </div>
              <span style={{flex:1,fontSize:13,color:"#264653",textDecoration:checked[k]?"line-through":"none"}}>{it.name}</span>
              <span style={{fontSize:13,color:"#888",fontWeight:600}}>{it.unit==="q.b."?"q.b.":Math.round(it.amount)+it.unit}</span>
            </div>);
          })}
        </div>
      ))}
    </div>}
  </div>);
}

// ── ADD RECIPE MODAL ──────────────────────────────────────────────────────
function AddRecipe({onAdd,onClose}){
  const[f,setF]=useState({name:"",cat:"pranzo",season:"all",tags:"",proc:"",kcal:"",prot:"",carb:"",fat:"",t:"",ing:[{n:"",a:"",u:"g",c:"verdure"}]});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const setI=(i,k,v)=>setF(p=>{const ng=[...p.ing];ng[i]={...ng[i],[k]:v};return{...p,ing:ng};});
  const ok=f.name&&f.kcal&&f.prot&&f.carb&&f.fat&&f.t&&f.ing.every(i=>i.n&&i.a);
  const submit=()=>{onAdd({id:Date.now(),name:f.name,cat:f.cat,season:f.season,veg:false,tags:f.tags.split(",").map(t=>t.trim()).filter(Boolean),proc:f.proc,kcal:+f.kcal,prot:+f.prot,carb:+f.carb,fat:+f.fat,t:+f.t,ing:f.ing.map(i=>({...i,a:+i.a})),custom:true});onClose();};
  return(<div className="ov" onClick={onClose}>
    <div className="mod" onClick={e=>e.stopPropagation()}>
      <div className="mhd"><h3 style={{color:"#264653"}}>✏️ Nuova ricetta</h3><button className="xb" onClick={onClose}>×</button></div>
      <div style={{marginBottom:10}}><label className="lbl">Nome *</label><input className="inp" value={f.name} onChange={e=>set("name",e.target.value)} placeholder="es. Pasta al pesto"/></div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1}}><label className="lbl">Categoria</label><select className="inp" value={f.cat} onChange={e=>set("cat",e.target.value)}>{MEALS.map(m=><option key={m.k} value={m.k}>{m.l}</option>)}</select></div>
        <div style={{flex:1}}><label className="lbl">Stagione</label><select className="inp" value={f.season} onChange={e=>set("season",e.target.value)}>{Object.entries(SEASONS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
      </div>
      <div style={{marginBottom:10}}><label className="lbl">Tag (separati da virgola)</label><input className="inp" value={f.tags} onChange={e=>set("tags",e.target.value)} placeholder="es. veloce, vegetariano"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {[{k:"kcal",l:"Calorie"},{k:"prot",l:"Proteine (g)"},{k:"carb",l:"Carboidrati (g)"},{k:"fat",l:"Grassi (g)"},{k:"t",l:"Tempo (min)"}].map(fd=>(
          <div key={fd.k}><label className="lbl" style={{fontSize:12}}>{fd.l} *</label><input className="inp" type="number" value={f[fd.k]} onChange={e=>set(fd.k,e.target.value)} placeholder="0"/></div>
        ))}
      </div>
      <div style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><label className="lbl" style={{margin:0}}>Ingredienti *</label><button className="btn bs" onClick={()=>setF(p=>({...p,ing:[...p.ing,{n:"",a:"",u:"g",c:"verdure"}]}))}>+ Aggiungi</button></div>
        {f.ing.map((ing,i)=>(
          <div key={i} style={{display:"flex",gap:4,marginBottom:5}}>
            <input className="inp" style={{flex:2}} value={ing.n} onChange={e=>setI(i,"n",e.target.value)} placeholder="Nome"/>
            <input className="inp" style={{flex:1}} type="number" value={ing.a} onChange={e=>setI(i,"a",e.target.value)} placeholder="Qtà"/>
            <select className="inp" style={{flex:1}} value={ing.u} onChange={e=>setI(i,"u",e.target.value)}>{["g","ml","q.b."].map(u=><option key={u}>{u}</option>)}</select>
            {f.ing.length>1&&<button className="btn" onClick={()=>setF(p=>({...p,ing:p.ing.filter((_,j)=>j!==i)}))} style={{padding:"8px",background:"#FFF0F0",color:"#E07340",borderRadius:8}}>✕</button>}
          </div>
        ))}
      </div>
      <div style={{marginBottom:14}}><label className="lbl">Procedimento</label><textarea className="inp" style={{height:70,resize:"vertical"}} value={f.proc} onChange={e=>set("proc",e.target.value)} placeholder="Come si prepara..."/></div>
      <button className="btn bp" disabled={!ok} onClick={submit}>💾 Salva ricetta</button>
    </div>
  </div>);
}

// ── PROFILE TAB ───────────────────────────────────────────────────────────
function ProfileTab({profile,onUpdate,feedbacks,onFb}){
  const[editing,setEditing]=useState(false);
  const[f,setF]=useState({...profile});
  const[fbTxt,setFbTxt]=useState("");
  const[fbR,setFbR]=useState(5);
  const[showFb,setShowFb]=useState(false);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const tgt=calcTgt(profile);
  return(<div>
    <div className="hdr"><h1>👤 Profilo</h1><p>Ciao, {profile.name}! 👋</p></div>
    <div className="cnt">
      <div className="cd">
        <div style={{fontWeight:700,color:"#264653",marginBottom:10,fontSize:14}}>📊 Il tuo fabbisogno giornaliero</div>
        <div style={{display:"flex",gap:6,marginBottom:10}}>
          {[{l:"Calorie",v:tgt.kcal+"kcal",c:"#E07340"},{l:"Proteine",v:tgt.prot+"g",c:"#2A9D8F"},{l:"Carb",v:tgt.carb+"g",c:"#E9A820"},{l:"Grassi",v:tgt.fat+"g",c:"#9C6B9E"}].map(m=>(
            <div key={m.l} style={{flex:1,background:m.c+"11",borderRadius:10,padding:"8px 4px",textAlign:"center"}}>
              <div style={{fontWeight:800,color:m.c,fontSize:13}}>{m.v}</div>
              <div style={{fontSize:10,color:"#888",marginTop:2}}>{m.l}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:12,color:"#666",display:"flex",gap:10,flexWrap:"wrap"}}>
          <span>🧬 {profile.sex==="M"?"Maschio":"Femmina"}</span><span>🎂 {profile.age}a</span>
          <span>📏 {profile.height}cm</span><span>⚖️ {profile.weight}kg</span>
          <span>🏃 {ACT.find(a=>a.k===profile.activity)?.l}</span>
          <span>{GOALS.find(g=>g.k===profile.goal)?.l}</span>
        </div>
      </div>
      {!editing?<div style={{padding:"0 12px"}}><button className="btn bp" onClick={()=>setEditing(true)}>✏️ Modifica profilo</button></div>:
        <div className="cd">
          <div style={{fontWeight:700,color:"#264653",marginBottom:12,fontSize:14}}>Modifica profilo</div>
          {[{k:"age",l:"Età (anni)"},{k:"height",l:"Altezza (cm)"},{k:"weight",l:"Peso (kg)"}].map(fd=>(
            <div key={fd.k} style={{marginBottom:10}}><label className="lbl" style={{fontSize:12}}>{fd.l}</label><input className="inp" type="number" value={f[fd.k]} onChange={e=>set(fd.k,+e.target.value)}/></div>
          ))}
          <label className="lbl" style={{fontSize:12}}>Attività</label>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
            {ACT.map(a=><button key={a.k} onClick={()=>set("activity",a.k)} className="btn" style={{padding:"9px",textAlign:"left",background:f.activity===a.k?"#E07340":"#fff",color:f.activity===a.k?"#fff":"#264653",border:"2px solid "+(f.activity===a.k?"#E07340":"#E8E0D8"),borderRadius:10,fontSize:12}}>{a.l}</button>)}
          </div>
          <label className="lbl" style={{fontSize:12}}>Obiettivo</label>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
            {GOALS.map(g=><button key={g.k} onClick={()=>set("goal",g.k)} className="btn" style={{padding:"9px",textAlign:"left",background:f.goal===g.k?"#E07340":"#fff",color:f.goal===g.k?"#fff":"#264653",border:"2px solid "+(f.goal===g.k?"#E07340":"#E8E0D8"),borderRadius:10,fontSize:12}}>{g.l}</button>)}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setEditing(false)} className="btn" style={{flex:1,padding:"11px",border:"2px solid #E8E0D8",color:"#888",background:"#fff",fontSize:13}}>Annulla</button>
            <button onClick={()=>{onUpdate(f);setEditing(false);}} className="btn bp" style={{flex:2}}>💾 Salva</button>
          </div>
        </div>
      }
      <div className="cd" style={{marginTop:4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontWeight:700,color:"#264653",fontSize:14}}>💬 Feedback & Note</div>
          <button className="btn bs" onClick={()=>setShowFb(p=>!p)}>{showFb?"Chiudi":"+ Nuovo"}</button>
        </div>
        {showFb&&<div style={{marginBottom:10}}>
          <div style={{display:"flex",gap:3,marginBottom:8,alignItems:"center"}}>
            <span style={{fontSize:12,color:"#666"}}>Voto:</span>
            {[1,2,3,4,5].map(s=><span key={s} onClick={()=>setFbR(s)} style={{fontSize:20,cursor:"pointer",opacity:s<=fbR?1:.25}}>{s<=fbR?"⭐":"☆"}</span>)}
          </div>
          <textarea className="inp" style={{height:70,resize:"vertical",marginBottom:6}} value={fbTxt} onChange={e=>setFbTxt(e.target.value)} placeholder="Scrivi feedback, note o idee..."/>
          <button className="btn bp" onClick={()=>{if(fbTxt.trim()){onFb({text:fbTxt,rating:fbR,date:new Date().toLocaleDateString("it-IT")});setFbTxt("");setShowFb(false);}}} disabled={!fbTxt.trim()}>Invia 💬</button>
        </div>}
        {feedbacks.length===0&&!showFb&&<div style={{color:"#CCC",fontSize:12,fontStyle:"italic"}}>Nessun feedback ancora</div>}
        {feedbacks.map((fb,i)=>(
          <div key={i} style={{padding:"8px 0",borderTop:"1px solid #F5F0E8"}}>
            <div style={{display:"flex",gap:2,marginBottom:3}}>{"⭐".repeat(fb.rating)}<span style={{fontSize:10,color:"#999",marginLeft:6}}>{fb.date}</span></div>
            <p style={{fontSize:12,color:"#555",margin:0}}>{fb.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>);
}

// ── APP ────────────────────────────────────────────────────────────────────
export default function App(){
  const[ready,setReady]=useState(false);
  const[profile,setProfile]=useState(null);
  const[wkMenus,setWkMenus]=useState({});
  const[curWk,setCurWk]=useState(getWkKey());
  const[savedMenus,setSavedMenus]=useState([]);
  const[customDB,setCustomDB]=useState([]);
  const[feedbacks,setFeedbacks]=useState([]);
  const[ratings,setRatings]=useState({});
  const[tab,setTab]=useState(0);
  const[showAdd,setShowAdd]=useState(false);
  const db=[...DB0,...customDB];
  const curMenu=wkMenus[curWk]||initWkMenu();

  useEffect(()=>{
    (async()=>{
      try{const r=await window.storage.get(SK);if(r?.value){const d=JSON.parse(r.value);setProfile(d.p||null);setWkMenus(d.wm||{});setCurWk(d.cw||getWkKey());setSavedMenus(d.sm||[]);setCustomDB(d.cdb||[]);setFeedbacks(d.fb||[]);setRatings(d.rt||{});}}catch(e){}
      setReady(true);
    })();
  },[]);

  const persist=async(state)=>{try{await window.storage.set(SK,JSON.stringify(state));}catch(e){}};
  const mkState=(p,wm,cw,sm,cdb,fb,rt)=>({p,wm,cw,sm,cdb,fb,rt});

  const handleSetup=p=>{setProfile(p);persist(mkState(p,wkMenus,curWk,savedMenus,customDB,feedbacks,ratings));};
  const updateProfile=p=>{setProfile(p);persist(mkState(p,wkMenus,curWk,savedMenus,customDB,feedbacks,ratings));};
  const changeWk=wk=>{setCurWk(wk);persist(mkState(profile,wkMenus,wk,savedMenus,customDB,feedbacks,ratings));};

  const updateMenu=(day,meal,rid,shopP,food=null)=>{
    const entry=food?food:rid?{rid,shopP:shopP||1}:null;
    const nwm={...wkMenus,[curWk]:{...curMenu,[day]:{...curMenu[day],[meal]:entry}}};
    setWkMenus(nwm);persist(mkState(profile,nwm,curWk,savedMenus,customDB,feedbacks,ratings));
  };
  const saveWk=name=>{
    const nsm=[...savedMenus,{id:Date.now(),name,wk:curWk,data:JSON.parse(JSON.stringify(curMenu))}];
    setSavedMenus(nsm);persist(mkState(profile,wkMenus,curWk,nsm,customDB,feedbacks,ratings));
  };
  const loadMenu=sm=>{
    const nwm={...wkMenus,[curWk]:sm.data};
    setWkMenus(nwm);persist(mkState(profile,nwm,curWk,savedMenus,customDB,feedbacks,ratings));
  };
  const delSaved=id=>{const nsm=savedMenus.filter(s=>s.id!==id);setSavedMenus(nsm);persist(mkState(profile,wkMenus,curWk,nsm,customDB,feedbacks,ratings));};
  const addRecipe=r=>{const ncdb=[...customDB,r];setCustomDB(ncdb);persist(mkState(profile,wkMenus,curWk,savedMenus,ncdb,feedbacks,ratings));};
  const addFb=fb=>{const nfb=[fb,...feedbacks];setFeedbacks(nfb);persist(mkState(profile,wkMenus,curWk,savedMenus,customDB,nfb,ratings));};
  const rateR=(id,s)=>{const nr={...ratings,[id]:s};setRatings(nr);persist(mkState(profile,wkMenus,curWk,savedMenus,customDB,feedbacks,nr));};

  if(!ready) return (<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#FFF8F0",fontSize:36}}>🫒</div>);
  if(!profile) return (<Setup onDone={handleSetup}/>);

  const TABS=[{i:"🔍",l:"Ricette"},{i:"📅",l:"Menù"},{i:"🛒",l:"Spesa"},{i:"👤",l:"Profilo"}];
  return(<div className="app">
    <style>{CSS}</style>
    {showAdd&&<AddRecipe onAdd={addRecipe} onClose={()=>setShowAdd(false)}/>}
    {tab===0&&<SearchTab db={db} onAddToMenu={updateMenu} ratings={ratings} onRate={rateR}/>}
    {tab===1&&<MenuTab curWk={curWk} wkMenus={wkMenus} db={db} profile={profile} onWkChange={changeWk} onUpdate={updateMenu} onSaveWk={saveWk} savedMenus={savedMenus} onLoadMenu={loadMenu} onDelSaved={delSaved} ratings={ratings} onRate={rateR}/>}
    {tab===2&&<ShopTab curWk={curWk} curMenu={curMenu} db={db}/>}
    {tab===3&&<ProfileTab profile={profile} onUpdate={updateProfile} feedbacks={feedbacks} onFb={addFb}/>}
    <div className="tbar">
      {TABS.map((t,i)=><button key={i} className={"tab"+(tab===i?" on":"")} onClick={()=>setTab(i)}><span className="ic">{t.i}</span><span>{t.l}</span></button>)}
      <button className={"tab"+(showAdd?" on":"")} onClick={()=>setShowAdd(p=>!p)}><span className="ic">➕</span><span>Ricetta</span></button>
    </div>
  </div>);
}