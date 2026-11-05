/* ══════════════════════════════════════════════
   ILLUSTRATIONS — drawn here, not scanned
   ══════════════════════════════════════════════ */
const C='var(--sc)';
const ART={

liaison:{cap:"The sleeping consonant wakes up",svg:`
<svg viewBox="0 0 600 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Liaison examples">
 <g font-family="var(--display)" font-size="21" font-weight="600">
  <text x="40" y="52" fill="var(--ink)">vou<tspan fill="${C}">s</tspan> êtes</text>
  <text x="40" y="104" fill="var(--ink)">le<tspan fill="${C}">s</tspan> enfants</text>
  <text x="40" y="156" fill="var(--ink)">un gran<tspan fill="${C}">d</tspan> homme</text>
  <text x="330" y="52" font-family="var(--mono)" font-size="15" fill="${C}">voo-Zet</text>
  <text x="330" y="104" font-family="var(--mono)" font-size="15" fill="${C}">lay-Zahn-FAHN</text>
  <text x="330" y="156" font-family="var(--mono)" font-size="15" fill="${C}">uhn grahn-TOM</text>
 </g>
 <g stroke="${C}" stroke-width="2" fill="none">
  <path d="M96 60 q12 14 26 0"/><path d="M86 112 q12 14 26 0"/><path d="M150 164 q12 14 26 0"/>
 </g>
 <g font-family="var(--mono)" font-size="11" fill="var(--ink-3)">
  <text x="470" y="52">s → z</text><text x="470" y="104">s → z</text><text x="470" y="156">d → t</text>
 </g>
</svg>`},

etreavoir:{cap:"The two verbs everything else is built on",svg:`
<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="être and avoir side by side">
 <g font-family="var(--mono)" font-size="13">
  <g transform="translate(20,16)">
   <rect width="256" height="150" rx="12" fill="none" stroke="${C}" stroke-width="2"/>
   <text x="128" y="30" text-anchor="middle" font-family="var(--display)" font-size="21" font-weight="800" fill="${C}">être</text>
   <text x="24" y="58" fill="var(--ink)">je suis</text><text x="150" y="58" fill="var(--ink)">nous sommes</text>
   <text x="24" y="80" fill="var(--ink)">tu es</text><text x="150" y="80" fill="var(--ink)">vous <tspan font-weight="700">ê</tspan>tes</text>
   <text x="24" y="102" fill="var(--ink)">il est</text><text x="150" y="102" fill="var(--ink)">ils sont</text>
   <text x="128" y="132" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-3)">ce que vous êtes</text>
  </g>
  <g transform="translate(324,16)">
   <rect width="256" height="150" rx="12" fill="none" stroke="${C}" stroke-width="2"/>
   <text x="128" y="30" text-anchor="middle" font-family="var(--display)" font-size="21" font-weight="800" fill="${C}">avoir</text>
   <text x="24" y="58" fill="var(--ink)">j'ai</text><text x="150" y="58" fill="var(--ink)">nous avons</text>
   <text x="24" y="80" fill="var(--ink)">tu as</text><text x="150" y="80" fill="var(--ink)">vous avez</text>
   <text x="24" y="102" fill="var(--ink)">il a</text><text x="150" y="102" fill="var(--ink)">ils ont</text>
   <text x="128" y="132" text-anchor="middle" font-family="var(--body)" font-size="11.5" fill="var(--ink-3)">ce que vous avez</text>
  </g>
 </g>
 <text x="300" y="188" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">The whole difference in speech: <tspan font-family="var(--mono)" fill="var(--ink)">ils sont</tspan> [s] &nbsp;vs&nbsp; <tspan font-family="var(--mono)" fill="var(--ink)">ils ont</tspan> [z]</text>
</svg>`},

possessif:{cap:"It agrees with the thing, not the owner",svg:`
<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="sa voiture works for both Marc and Marie">
 <g font-family="var(--display)" font-size="17" font-weight="600" text-anchor="middle">
  <g transform="translate(120,48)">
   <circle r="26" fill="none" stroke="var(--ink-3)" stroke-width="2"/>
   <text y="6" fill="var(--ink)">Marc</text>
   <text y="56" font-size="12" font-family="var(--mono)" fill="var(--ink-3)">masculin</text>
  </g>
  <g transform="translate(120,140)">
   <circle r="26" fill="none" stroke="var(--ink-3)" stroke-width="2"/>
   <text y="6" fill="var(--ink)">Marie</text>
   <text y="46" font-size="12" font-family="var(--mono)" fill="var(--ink-3)">féminin</text>
  </g>
  <g transform="translate(430,94)">
   <rect x="-118" y="-30" width="236" height="60" rx="12" fill="${C}"/>
   <text y="6" fill="#fff" font-size="20">sa voiture</text>
   <text y="52" font-size="12" font-family="var(--mono)" fill="${C}">voiture = féminin → sa</text>
  </g>
 </g>
 <g stroke="var(--rule)" stroke-width="2" fill="none">
  <path d="M150 52 C230 52 250 80 306 90"/><path d="M150 140 C230 140 250 108 306 98"/>
 </g>
 <text x="300" y="192" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">English picks the owner's gender. French never does.</text>
</svg>`},

etretable:{cap:"Être — and the liaison that changes the meaning",svg:`
<svg viewBox="0 0 600 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Conjugation of etre">
 <g font-family="var(--mono)" font-size="14">
  <text x="30" y="34" fill="var(--ink-3)">je</text><text x="120" y="34" font-weight="500" fill="var(--ink)">suis</text>
  <text x="30" y="60" fill="var(--ink-3)">tu</text><text x="120" y="60" font-weight="500" fill="var(--ink)">es</text>
  <text x="30" y="86" fill="var(--ink-3)">il / elle / on</text><text x="120" y="86" font-weight="500" fill="var(--ink)">est</text>
  <text x="300" y="34" fill="var(--ink-3)">nous</text><text x="400" y="34" font-weight="500" fill="var(--ink)">sommes</text>
  <text x="300" y="60" fill="var(--ink-3)">vous</text><text x="400" y="60" font-weight="500" fill="${C}">êtes</text>
  <text x="300" y="86" fill="var(--ink-3)">ils / elles</text><text x="400" y="86" font-weight="500" fill="var(--ink)">sont</text>
 </g>
 <path d="M395 50 q10 10 20 0" stroke="${C}" stroke-width="1.6" fill="none"/>
 <text x="418" y="76" font-family="var(--mono)" font-size="10" fill="${C}">z</text>
 <line x1="30" y1="112" x2="570" y2="112" stroke="var(--rule)" stroke-width="1.5"/>
 <g font-family="var(--display)" font-size="19" font-weight="700">
  <text x="30" y="146" fill="var(--ink)">ils <tspan fill="var(--ink-3)">s</tspan>ont</text>
  <text x="180" y="146" fill="var(--ink-2)" font-size="14" font-family="var(--body)" font-weight="400">they are</text>
  <text x="330" y="146" fill="var(--ink)">ils <tspan fill="${C}">z</tspan>ont</text>
  <text x="470" y="146" fill="var(--ink-2)" font-size="14" font-family="var(--body)" font-weight="400">they have</text>
 </g>
 <text x="30" y="186" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Same three letters on the page. One consonant apart in the ear.</text>
</svg>`},

avoirtable:{cap:"Avoir — where French has and English is",svg:`
<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Conjugation of avoir and idioms">
 <g font-family="var(--mono)" font-size="14">
  <text x="30" y="34" fill="var(--ink-3)">j'</text><text x="120" y="34" font-weight="500" fill="var(--ink)">ai</text>
  <text x="30" y="60" fill="var(--ink-3)">tu</text><text x="120" y="60" font-weight="500" fill="var(--ink)">as</text>
  <text x="30" y="86" fill="var(--ink-3)">il / elle / on</text><text x="120" y="86" font-weight="500" fill="var(--ink)">a</text>
  <text x="300" y="34" fill="var(--ink-3)">nous</text><text x="400" y="34" font-weight="500" fill="${C}">avons</text>
  <text x="300" y="60" fill="var(--ink-3)">vous</text><text x="400" y="60" font-weight="500" fill="${C}">avez</text>
  <text x="300" y="86" fill="var(--ink-3)">ils / elles</text><text x="400" y="86" font-weight="500" fill="${C}">ont</text>
 </g>
 <text x="470" y="60" font-family="var(--mono)" font-size="10.5" fill="${C}">liaison z</text>
 <line x1="30" y1="110" x2="570" y2="110" stroke="var(--rule)" stroke-width="1.5"/>
 <g font-family="var(--body)" font-size="13">
  <text x="30" y="138" font-weight="600" fill="var(--ink)">j'ai faim</text><text x="170" y="138" fill="var(--ink-3)">I am hungry</text>
  <text x="30" y="162" font-weight="600" fill="var(--ink)">j'ai 25 ans</text><text x="170" y="162" fill="var(--ink-3)">I am 25</text>
  <text x="330" y="138" font-weight="600" fill="var(--ink)">j'ai froid</text><text x="460" y="138" fill="var(--ink-3)">I am cold</text>
  <text x="330" y="162" font-weight="600" fill="var(--ink)">j'ai peur</text><text x="460" y="162" fill="var(--ink-3)">I am afraid</text>
 </g>
 <text x="30" y="198" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Never <tspan font-family="var(--mono)" fill="#B3452F">je suis faim</tspan>. French <em>has</em> hunger, cold, fear and years.</text>
</svg>`},

possessifs:{cap:"It agrees with the thing, not the owner",svg:`
<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Possessive adjectives table">
 <g font-family="var(--mono)" font-size="11" fill="var(--ink-3)">
  <text x="150" y="26">MASC.</text><text x="290" y="26">FÉM.</text><text x="430" y="26">PLURIEL</text>
 </g>
 <g font-family="var(--mono)" font-size="14" fill="var(--ink)">
  <text x="30" y="52" fill="var(--ink-3)">my</text><text x="150" y="52">mon</text><text x="290" y="52">ma</text><text x="430" y="52">mes</text>
  <text x="30" y="76" fill="var(--ink-3)">your</text><text x="150" y="76">ton</text><text x="290" y="76">ta</text><text x="430" y="76">tes</text>
  <text x="30" y="100" fill="var(--ink-3)">his / her</text><text x="150" y="100" fill="${C}">son</text><text x="290" y="100" fill="${C}">sa</text><text x="430" y="100" fill="${C}">ses</text>
  <text x="30" y="124" fill="var(--ink-3)">our</text><text x="150" y="124">notre</text><text x="290" y="124">notre</text><text x="430" y="124">nos</text>
  <text x="30" y="148" fill="var(--ink-3)">your</text><text x="150" y="148">votre</text><text x="290" y="148">votre</text><text x="430" y="148">vos</text>
  <text x="30" y="172" fill="var(--ink-3)">their</text><text x="150" y="172">leur</text><text x="290" y="172">leur</text><text x="430" y="172">leurs</text>
 </g>
 <line x1="30" y1="186" x2="570" y2="186" stroke="var(--rule)" stroke-width="1.5"/>
 <text x="30" y="208" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)"><tspan font-family="var(--mono)" fill="${C}">son père</tspan> = his father <tspan fill="var(--ink-3)">and</tspan> her father. The noun decides, never the owner.</text>
</svg>`},

erverbs:{cap:"Four forms, one sound",svg:`
<svg viewBox="0 0 600 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Silent and audible endings of -er verbs">
 <g font-family="var(--display)" font-size="19" font-weight="600">
  <text x="34" y="52" fill="var(--ink)">je parl<tspan fill="var(--ink-3)">e</tspan></text>
  <text x="34" y="82" fill="var(--ink)">tu parl<tspan fill="var(--ink-3)">es</tspan></text>
  <text x="34" y="112" fill="var(--ink)">il parl<tspan fill="var(--ink-3)">e</tspan></text>
  <text x="34" y="142" fill="var(--ink)">ils parl<tspan fill="var(--ink-3)">ent</tspan></text>
  <text x="360" y="52" fill="var(--ink)">nous parl<tspan fill="${C}">ons</tspan></text>
  <text x="360" y="82" fill="var(--ink)">vous parl<tspan fill="${C}">ez</tspan></text>
 </g>
 <path d="M196 96 h56" stroke="var(--rule)" stroke-width="2"/>
 <g transform="translate(292,96)">
  <circle r="34" fill="var(--ink)"/>
  <text y="5" text-anchor="middle" font-family="var(--mono)" font-size="15" fill="#fff">parl</text>
 </g>
 <path d="M172 52 C210 52 200 88 254 94 M172 82 C205 82 200 90 254 95 M172 112 C205 112 200 102 254 98 M172 142 C210 142 200 106 254 100"
   stroke="var(--rule)" stroke-width="1.4" fill="none"/>
 <g font-family="var(--mono)" font-size="11" fill="var(--ink-3)">
  <text x="34" y="176">finales muettes — vous n'entendez rien</text>
  <text x="360" y="112" fill="${C}">finales sonores</text>
 </g>
 <text x="34" y="198" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Only <tspan font-family="var(--mono)" fill="var(--ink)">nous</tspan> and <tspan font-family="var(--mono)" fill="var(--ink)">vous</tspan> can be heard. The other four are identical.</text>
</svg>`},

particularites:{cap:"Where the spelling bends to protect the sound",svg:`
<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Spelling changes in -er verbs">
 <g font-family="var(--mono)" font-size="12.5">
  <g transform="translate(0,10)">
   <text x="24" y="20" font-family="var(--display)" font-size="15" font-weight="700" fill="${C}">accent grave</text>
   <text x="24" y="44" fill="var(--ink)">je préf<tspan font-weight="700" fill="${C}">è</tspan>re</text>
   <text x="150" y="44" fill="var(--ink-3)">↔</text>
   <text x="184" y="44" fill="var(--ink)">nous préf<tspan font-weight="700" fill="${C}">é</tspan>rons</text>
   <text x="24" y="66" fill="var(--ink)">j'ach<tspan font-weight="700" fill="${C}">è</tspan>te</text>
   <text x="150" y="66" fill="var(--ink-3)">↔</text>
   <text x="184" y="66" fill="var(--ink)">nous ach<tspan font-weight="700" fill="${C}">e</tspan>tons</text>
  </g>
  <g transform="translate(0,90)">
   <text x="24" y="20" font-family="var(--display)" font-size="15" font-weight="700" fill="${C}">consonne doublée</text>
   <text x="24" y="44" fill="var(--ink)">je je<tspan font-weight="700" fill="${C}">tt</tspan>e</text>
   <text x="150" y="44" fill="var(--ink-3)">↔</text>
   <text x="184" y="44" fill="var(--ink)">nous je<tspan font-weight="700" fill="${C}">t</tspan>ons</text>
   <text x="24" y="66" fill="var(--ink)">j'appe<tspan font-weight="700" fill="${C}">ll</tspan>e</text>
   <text x="150" y="66" fill="var(--ink-3)">↔</text>
   <text x="184" y="66" fill="var(--ink)">nous appe<tspan font-weight="700" fill="${C}">l</tspan>ons</text>
  </g>
  <g transform="translate(360,10)">
   <text x="0" y="20" font-family="var(--display)" font-size="15" font-weight="700" fill="${C}">-ger et -cer</text>
   <text x="0" y="44" fill="var(--ink)">nous man<tspan font-weight="700" fill="${C}">ge</tspan>ons</text>
   <text x="0" y="66" fill="var(--ink)">nous voya<tspan font-weight="700" fill="${C}">ge</tspan>ons</text>
   <text x="0" y="88" fill="var(--ink)">nous commen<tspan font-weight="700" fill="${C}">ç</tspan>ons</text>
   <text x="0" y="110" fill="var(--ink)">nous avan<tspan font-weight="700" fill="${C}">ç</tspan>ons</text>
   <text x="0" y="140" font-size="11" fill="var(--ink-3)">le g et le c restent doux</text>
  </g>
 </g>
 <text x="24" y="208" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">The spelling only changes where the ending is <strong>silent</strong> — nous and vous keep the plain form.</text>
</svg>`},

reflexif:{cap:"When the subject is also the object",svg:`
<svg viewBox="0 0 600 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Reflexive versus ordinary verb">
 <g transform="translate(20,26)">
  <rect width="250" height="96" rx="12" fill="none" stroke="var(--rule)" stroke-width="1.8"/>
  <text x="125" y="34" text-anchor="middle" font-family="var(--display)" font-size="17" font-weight="600" fill="var(--ink)">Je lave ma voiture.</text>
  <g transform="translate(125,62)" stroke="var(--ink-3)" stroke-width="2" fill="none">
   <circle cx="-52" cy="0" r="9"/><path d="M-40 0 h68" stroke-linecap="round"/><path d="M20 -6 l8 6 -8 6" stroke-linejoin="round"/>
   <rect x="36" y="-9" width="18" height="18" rx="3"/>
  </g>
  <text x="125" y="88" text-anchor="middle" font-family="var(--mono)" font-size="10.5" fill="var(--ink-3)">sujet ≠ objet</text>
 </g>
 <g transform="translate(330,26)">
  <rect width="250" height="96" rx="12" fill="color-mix(in srgb,${C} 10%,transparent)" stroke="${C}" stroke-width="1.8"/>
  <text x="125" y="34" text-anchor="middle" font-family="var(--display)" font-size="17" font-weight="600" fill="var(--ink)">Je <tspan fill="${C}">me</tspan> lave.</text>
  <g transform="translate(125,62)" stroke="${C}" stroke-width="2" fill="none">
   <circle cx="0" cy="0" r="9"/>
   <path d="M9 -4 a20 20 0 1 1 -18 0" stroke-linecap="round"/>
   <path d="M-13 -10 l-1 10 10 -2" stroke-linejoin="round"/>
  </g>
  <text x="125" y="88" text-anchor="middle" font-family="var(--mono)" font-size="10.5" fill="${C}">sujet = objet</text>
 </g>
 <text x="300" y="152" text-anchor="middle" font-size="13" font-family="var(--body)" fill="var(--ink-2)">The pronoun always sits <strong>in front of</strong> the verb: me · te · se · nous · vous · se</text>
 <text x="300" y="176" text-anchor="middle" font-size="12.5" font-family="var(--mono)" fill="var(--ink-3)">✗ je regarde moi &nbsp;&nbsp;✓ je me regarde</text>
</svg>`},

arbre3:{cap:"La famille Bossan",svg:`
<svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bossan family tree">
 <g font-family="var(--body)" font-size="11.5" text-anchor="middle">
  <g>
   <rect x="196" y="14" width="98" height="30" rx="7" fill="none" stroke="var(--ink-3)" stroke-width="1.4"/>
   <text x="245" y="33" fill="var(--ink)">Jacques</text>
   <rect x="306" y="14" width="98" height="30" rx="7" fill="none" stroke="var(--ink-3)" stroke-width="1.4"/>
   <text x="355" y="33" fill="var(--ink)">Hélène</text>
   <path d="M294 29 h12" stroke="var(--ink-3)" stroke-width="1.4"/>
  </g>
  <path d="M300 44 v18 M120 62 H480 M120 62 v16 M480 62 v16" stroke="var(--rule)" stroke-width="1.4" fill="none"/>
  <g>
   <rect x="24" y="78" width="94" height="30" rx="7" fill="none" stroke="var(--ink-3)" stroke-width="1.4"/>
   <text x="71" y="97" fill="var(--ink)">Franck</text>
   <rect x="128" y="78" width="94" height="30" rx="7" fill="color-mix(in srgb,${C} 14%,transparent)" stroke="${C}" stroke-width="1.6"/>
   <text x="175" y="97" fill="var(--ink)">Sonia</text>
   <path d="M118 93 h10" stroke="var(--ink-3)" stroke-width="1.4"/>
   <rect x="378" y="78" width="94" height="30" rx="7" fill="color-mix(in srgb,${C} 14%,transparent)" stroke="${C}" stroke-width="1.6"/>
   <text x="425" y="97" fill="var(--ink)">Laure</text>
   <rect x="482" y="78" width="94" height="30" rx="7" fill="none" stroke="var(--ink-3)" stroke-width="1.4"/>
   <text x="529" y="97" fill="var(--ink)">Philippe</text>
   <path d="M472 93 h10" stroke="var(--ink-3)" stroke-width="1.4"/>
  </g>
  <path d="M123 108 v22 M475 108 v14 M330 122 H575 M330 122 v8 M430 122 v8 M525 122 v8" stroke="var(--rule)" stroke-width="1.4" fill="none"/>
  <g>
   <rect x="66" y="130" width="112" height="32" rx="7" fill="var(--ink)"/>
   <text x="122" y="150" fill="var(--paper)" font-weight="600">Florian</text>
   <rect x="288" y="130" width="84" height="32" rx="7" fill="none" stroke="var(--ink-3)" stroke-width="1.4"/>
   <text x="330" y="150" fill="var(--ink)">Marion</text>
   <rect x="386" y="130" width="88" height="32" rx="7" fill="none" stroke="var(--ink-3)" stroke-width="1.4"/>
   <text x="430" y="150" fill="var(--ink)">Camille</text>
   <rect x="484" y="130" width="92" height="32" rx="7" fill="none" stroke="var(--ink-3)" stroke-width="1.4"/>
   <text x="530" y="150" fill="var(--ink)">Alexandre</text>
  </g>
 </g>
 <g font-family="var(--mono)" font-size="10" fill="var(--ink-3)">
  <text x="24" y="186">Florian parle :</text>
 </g>
 <g font-family="var(--body)" font-size="12" fill="var(--ink-2)">
  <text x="24" y="206">Sonia = <tspan fill="var(--ink)" font-weight="600">ma mère</tspan> · Laure = <tspan fill="var(--ink)" font-weight="600">ma tante</tspan> · Philippe = <tspan fill="var(--ink)" font-weight="600">mon oncle</tspan></text>
  <text x="24" y="228">Marion et Camille = <tspan fill="var(--ink)" font-weight="600">mes cousines</tspan> · Jacques et Hélène = <tspan fill="var(--ink)" font-weight="600">mes grands-parents</tspan></text>
 </g>
</svg>`},

faireall:{cap:"aller goes to a place · faire does an activity",svg:`
<svg viewBox="0 0 600 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="aller plus place versus faire plus activity">
 <g transform="translate(20,20)">
  <rect width="260" height="128" rx="12" fill="none" stroke="var(--rule)" stroke-width="1.8"/>
  <text x="130" y="26" text-anchor="middle" font-family="var(--mono)" font-size="10.5" letter-spacing="2" fill="var(--ink-3)">ALLER + LIEU</text>
  <text x="130" y="56" text-anchor="middle" font-family="var(--display)" font-size="21" font-weight="800" fill="${C}">au · à la · à l'</text>
  <g font-family="var(--mono)" font-size="12" fill="var(--ink-2)">
   <text x="24" y="82">je vais <tspan fill="var(--ink)">au</tspan> cinéma</text>
   <text x="24" y="102">je vais <tspan fill="var(--ink)">à la</tspan> mer</text>
   <text x="24" y="122">je vais <tspan fill="var(--ink)">à l'</tspan>étranger</text>
  </g>
 </g>
 <g transform="translate(320,20)">
  <rect width="260" height="128" rx="12" fill="none" stroke="var(--rule)" stroke-width="1.8"/>
  <text x="130" y="26" text-anchor="middle" font-family="var(--mono)" font-size="10.5" letter-spacing="2" fill="var(--ink-3)">FAIRE + ACTIVITÉ</text>
  <text x="130" y="56" text-anchor="middle" font-family="var(--display)" font-size="21" font-weight="800" fill="${C}">du · de la · de l'</text>
  <g font-family="var(--mono)" font-size="12" fill="var(--ink-2)">
   <text x="24" y="82">je fais <tspan fill="var(--ink)">du</tspan> vélo</text>
   <text x="24" y="102">je fais <tspan fill="var(--ink)">de la</tspan> photo</text>
   <text x="24" y="122">je fais <tspan fill="var(--ink)">de l'</tspan>escalade</text>
  </g>
 </g>
 <text x="300" y="182" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Where you go takes <tspan font-family="var(--mono)" fill="var(--ink)">à</tspan>. What you do takes <tspan font-family="var(--mono)" fill="var(--ink)">de</tspan>.</text>
</svg>`},

toniques:{cap:"The stressed pronouns",svg:`
<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stressed pronouns paired with subject pronouns">
 <g font-family="var(--mono)" font-size="13.5">
  <text x="40" y="34" fill="var(--ink-3)">moi</text><text x="150" y="34" fill="var(--ink)">je</text>
  <text x="40" y="60" fill="var(--ink-3)">toi</text><text x="150" y="60" fill="var(--ink)">tu</text>
  <text x="40" y="86" fill="var(--ink-3)">lui</text><text x="150" y="86" fill="var(--ink)">il</text>
  <text x="40" y="112" fill="var(--ink-3)">elle</text><text x="150" y="112" fill="var(--ink)">elle</text>
  <text x="330" y="34" fill="var(--ink-3)">nous</text><text x="450" y="34" fill="var(--ink)">nous</text>
  <text x="330" y="60" fill="var(--ink-3)">vous</text><text x="450" y="60" fill="var(--ink)">vous</text>
  <text x="330" y="86" fill="var(--ink-3)">eux</text><text x="450" y="86" fill="var(--ink)">ils</text>
  <text x="330" y="112" fill="var(--ink-3)">elles</text><text x="450" y="112" fill="var(--ink)">elles</text>
 </g>
 <g stroke="var(--rule)" stroke-width="1.4">
  <path d="M92 30 h48"/><path d="M92 56 h48"/><path d="M92 82 h48"/><path d="M92 108 h48"/>
  <path d="M392 30 h48"/><path d="M392 56 h48"/><path d="M392 82 h48"/><path d="M392 108 h48"/>
 </g>
 <line x1="40" y1="136" x2="560" y2="136" stroke="var(--rule)" stroke-width="1.5"/>
 <text x="40" y="162" font-family="var(--display)" font-size="17" font-weight="700" fill="${C}">Moi, je suis lion.</text>
 <text x="300" y="162" font-family="var(--display)" font-size="17" font-weight="700" fill="${C}">Eux, ils détestent les chats.</text>
 <text x="40" y="188" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Used to stress the person, or to stand alone: <tspan font-family="var(--mono)" fill="var(--ink)">Et toi ?</tspan></text>
</svg>`},

itineraire:{cap:"Six ways to send someone down the street",svg:`
<svg viewBox="0 0 600 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Direction phrases with arrows">
 <g stroke="${C}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <g transform="translate(70,50)"><path d="M0 26 V-8"/><path d="M-7 -1 L0 -10 L7 -1"/></g>
  <g transform="translate(230,50)"><path d="M0 26 V2 H-22"/><path d="M-15 -5 L-24 2 L-15 9"/></g>
  <g transform="translate(390,50)"><path d="M0 26 V2 H22"/><path d="M15 -5 L24 2 L15 9"/></g>
  <g transform="translate(530,50)"><path d="M-24 20 H24"/><path d="M17 13 L26 20 L17 27"/><path d="M-16 4 v-14 M0 4 v-14 M16 4 v-14" stroke-width="1.6" stroke-dasharray="4 4"/></g>
  <g transform="translate(150,150)"><path d="M0 26 V6"/><path d="M0 6 H-26"/><path d="M-19 -1 L-28 6 L-19 13"/><path d="M0 26 V16 M0 12 V6" stroke-dasharray="3 3"/></g>
  <g transform="translate(400,150)"><path d="M-26 20 H26"/><path d="M-26 -8 H26" stroke-dasharray="5 5" stroke-width="1.6"/><path d="M0 20 V-8"/><path d="M-7 -1 L0 -10 L7 -1"/></g>
 </g>
 <g font-family="var(--body)" font-size="12" fill="var(--ink)" text-anchor="middle" font-weight="600">
  <text x="70" y="98">continuer tout droit</text>
  <text x="230" y="98">tourner à gauche</text>
  <text x="390" y="98">tourner à droite</text>
  <text x="530" y="98">traverser la rue</text>
  <text x="150" y="198">prendre la 2e à gauche</text>
  <text x="400" y="198">prendre la rue…</text>
 </g>
 <text x="300" y="222" text-anchor="middle" font-size="12" font-family="var(--body)" fill="var(--ink-2)">Speaking: <tspan font-family="var(--mono)" fill="var(--ink)">vous tournez</tspan>. Writing only: <tspan font-family="var(--mono)" fill="var(--ink)">tourner</tspan>.</text>
</svg>`},

provenance:{cap:"Coming from, going to",svg:`
<svg viewBox="0 0 600 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="de du des for origin, en au aux for destination">
 <g transform="translate(0,20)">
  <rect x="24" y="0" width="240" height="120" rx="12" fill="none" stroke="var(--rule)" stroke-width="1.8"/>
  <text x="144" y="26" text-anchor="middle" font-family="var(--mono)" font-size="11" letter-spacing="2" fill="var(--ink-3)">PROVENANCE</text>
  <text x="144" y="60" text-anchor="middle" font-family="var(--display)" font-size="26" font-weight="800" fill="${C}">de · d' · du · des</text>
  <text x="144" y="88" text-anchor="middle" font-family="var(--mono)" font-size="12.5" fill="var(--ink-2)">La lettre vient du Portugal.</text>
  <text x="144" y="106" text-anchor="middle" font-family="var(--mono)" font-size="12.5" fill="var(--ink-2)">Elle vient d'Espagne.</text>

  <g transform="translate(300,60)" stroke="${C}" stroke-width="2.4" fill="none" stroke-linecap="round">
   <path d="M-14 0 h28"/><path d="M8 -7 l8 7 -8 7" stroke-linejoin="round"/>
  </g>

  <rect x="336" y="0" width="240" height="120" rx="12" fill="none" stroke="var(--rule)" stroke-width="1.8"/>
  <text x="456" y="26" text-anchor="middle" font-family="var(--mono)" font-size="11" letter-spacing="2" fill="var(--ink-3)">DESTINATION</text>
  <text x="456" y="60" text-anchor="middle" font-family="var(--display)" font-size="26" font-weight="800" fill="${C}">en · au · aux</text>
  <text x="456" y="88" text-anchor="middle" font-family="var(--mono)" font-size="12.5" fill="var(--ink-2)">Elle est adressée au Japon.</text>
  <text x="456" y="106" text-anchor="middle" font-family="var(--mono)" font-size="12.5" fill="var(--ink-2)">Elle est adressée en Tunisie.</text>
 </g>
 <text x="300" y="192" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Feminine → de / en · masculine → du / au · plural → des / aux</text>
</svg>`},

prepolieu:{cap:"Où ? — the ten prepositions of place",svg:`
<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram of French prepositions of place">
 <defs>
  <g id="bx"><rect x="-21" y="-15" width="42" height="30" rx="4" fill="none" stroke="var(--ink-3)" stroke-width="1.8"/></g>
 </defs>
 <g font-family="var(--mono)" font-size="11.5" fill="var(--ink-2)" text-anchor="middle">

  <g transform="translate(70,44)"><use href="#bx"/><circle cy="0" r="6.5" fill="${C}"/><text y="36">dans</text></g>
  <g transform="translate(190,44)"><use href="#bx"/><circle cy="-22" r="6.5" fill="${C}"/><text y="36">sur</text></g>
  <g transform="translate(310,44)"><use href="#bx"/><circle cy="24" r="6.5" fill="${C}"/><text y="46">sous</text></g>
  <g transform="translate(440,44)"><use href="#bx"/><circle cx="-36" r="6.5" fill="${C}"/><text y="36">devant</text></g>
  <g transform="translate(552,44)"><use href="#bx"/><circle cx="34" r="6.5" fill="${C}"/><text y="36">derrière</text></g>

  <g transform="translate(70,160)"><use href="#bx"/><circle cx="-32" r="6.5" fill="${C}"/><text y="36">à gauche de</text></g>
  <g transform="translate(200,160)"><use href="#bx"/><circle cx="32" r="6.5" fill="${C}"/><text y="36">à droite de</text></g>
  <g transform="translate(330,160)"><use href="#bx"/><circle cx="-30" r="6.5" fill="${C}"/><text y="36">à côté de</text></g>
  <g transform="translate(462,160)">
    <use href="#bx"/><circle cx="-56" r="6.5" fill="${C}"/>
    <line x1="-48" y1="0" x2="-24" y2="0" stroke="${C}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <text y="36">près de</text>
  </g>
  <g transform="translate(566,160)"><circle cx="18" r="6.5" fill="none" stroke="${C}" stroke-width="1.8"/><text x="18" y="36">loin de</text></g>

  <g transform="translate(120,250)">
    <use href="#bx"/><g transform="translate(90,0)"><use href="#bx"/></g>
    <line x1="24" y1="0" x2="66" y2="0" stroke="${C}" stroke-width="1.5"/>
    <text x="45" y="36">en face de</text>
  </g>
 </g>
 <line x1="24" y1="212" x2="576" y2="212" stroke="var(--rule)" stroke-width="1.5"/>
 <text x="300" y="292" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">All of these take <tspan font-family="var(--mono)" fill="var(--ink)">de</tspan> — and de + le becomes <tspan font-family="var(--mono)" fill="var(--ink)">du</tspan>, de + les becomes <tspan font-family="var(--mono)" fill="var(--ink)">des</tspan>.</text>
</svg>`},

voisins:{cap:"France, its six neighbours and three seas",svg:`
<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hexagon of France with neighbouring countries and surrounding seas">
 <g transform="translate(300,150)">
  <path d="M0 -86 L74 -43 L74 43 L0 86 L-74 43 L-74 -43 Z" fill="${C}" opacity=".16" stroke="${C}" stroke-width="2.5"/>
  <text y="-4" text-anchor="middle" font-family="var(--display)" font-size="24" font-weight="800" fill="var(--ink)">la France</text>
  <text y="18" text-anchor="middle" font-family="var(--mono)" font-size="11" fill="var(--ink-3)">l'Hexagone</text>
 </g>
 <g font-family="var(--body)" font-size="13" font-weight="600" fill="var(--ink)" text-anchor="middle">
  <text x="300" y="30">la Belgique</text>
  <text x="452" y="30">le Luxembourg</text>
  <text x="500" y="106">l'Allemagne</text>
  <text x="508" y="196">la Suisse</text>
  <text x="470" y="268">l'Italie</text>
  <text x="120" y="268">l'Espagne</text>
 </g>
 <g stroke="var(--rule)" stroke-width="1.5" fill="none">
  <path d="M300 40 v22"/><path d="M440 40 l-70 34"/><path d="M470 116 l-90 22"/>
  <path d="M478 190 l-100 -12"/><path d="M450 254 l-90 -46"/><path d="M158 254 l84 -46"/>
 </g>
 <g font-family="var(--mono)" font-size="11" fill="${C}" font-style="italic">
  <text x="24" y="106">l'océan</text><text x="24" y="122">Atlantique</text>
  <text x="24" y="40">la mer du Nord</text>
  <text x="330" y="288">la mer Méditerranée</text>
 </g>
 <text x="24" y="176" font-family="var(--body)" font-size="11.5" fill="var(--ink-3)">francophones :</text>
 <text x="24" y="194" font-family="var(--body)" font-size="11.5" font-weight="600" fill="var(--ink)">Belgique · Suisse</text>
 <text x="24" y="210" font-family="var(--body)" font-size="11.5" font-weight="600" fill="var(--ink)">Luxembourg</text>
</svg>`},

prepos:{cap:"Which little word goes in front of the country",svg:`
<svg viewBox="0 0 600 232" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="en, au, aux and a with country names">
 <g font-family="var(--display)">
  <g transform="translate(20,16)">
   <rect width="132" height="58" rx="10" fill="${C}"/>
   <text x="66" y="38" text-anchor="middle" font-size="26" font-weight="800" fill="#fff">en</text>
   <text x="66" y="82" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">féminin</text>
   <text x="66" y="100" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">ou voyelle</text>
   <text x="66" y="132" text-anchor="middle" font-size="13.5" font-family="var(--mono)" fill="var(--ink)">en Tunisie</text>
   <text x="66" y="152" text-anchor="middle" font-size="13.5" font-family="var(--mono)" fill="var(--ink)">en Italie</text>
  </g>
  <g transform="translate(168,16)">
   <rect width="132" height="58" rx="10" fill="${C}" opacity=".72"/>
   <text x="66" y="38" text-anchor="middle" font-size="26" font-weight="800" fill="#fff">au</text>
   <text x="66" y="82" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">masculin</text>
   <text x="66" y="132" text-anchor="middle" font-size="13.5" font-family="var(--mono)" fill="var(--ink)">au Sénégal</text>
   <text x="66" y="152" text-anchor="middle" font-size="13.5" font-family="var(--mono)" fill="var(--ink)">au Canada</text>
  </g>
  <g transform="translate(316,16)">
   <rect width="132" height="58" rx="10" fill="${C}" opacity=".46"/>
   <text x="66" y="38" text-anchor="middle" font-size="26" font-weight="800" fill="#fff">aux</text>
   <text x="66" y="82" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">pluriel</text>
   <text x="66" y="132" text-anchor="middle" font-size="13.5" font-family="var(--mono)" fill="var(--ink)">aux États-Unis</text>
   <text x="66" y="152" text-anchor="middle" font-size="13.5" font-family="var(--mono)" fill="var(--ink)">aux Philippines</text>
  </g>
  <g transform="translate(464,16)">
   <rect width="116" height="58" rx="10" fill="none" stroke="${C}" stroke-width="2"/>
   <text x="58" y="38" text-anchor="middle" font-size="26" font-weight="800" fill="${C}">à</text>
   <text x="58" y="82" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">les villes et</text>
   <text x="58" y="100" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">quelques îles</text>
   <text x="58" y="132" text-anchor="middle" font-size="13.5" font-family="var(--mono)" fill="var(--ink)">à Madagascar</text>
   <text x="58" y="152" text-anchor="middle" font-size="13.5" font-family="var(--mono)" fill="var(--ink)">à Paris</text>
  </g>
 </g>
 <line x1="20" y1="184" x2="580" y2="184" stroke="var(--rule)" stroke-width="1.5"/>
 <text x="20" y="208" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Works the same after <tspan font-family="var(--mono)" fill="var(--ink)">j'habite</tspan>, <tspan font-family="var(--mono)" fill="var(--ink)">je suis né(e)</tspan> and <tspan font-family="var(--mono)" fill="var(--ink)">je vis</tspan>.</text>
</svg>`},

alphabet:{cap:"Three letters whose names catch people out",svg:`
<svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The letters E, G and W with their spoken French names">
 <g font-family="var(--display)" text-anchor="middle">
  <g transform="translate(100,0)">
    <rect x="-52" y="16" width="104" height="72" rx="10" fill="none" stroke="${C}" stroke-width="2"/>
    <text y="70" font-size="46" font-weight="800" fill="var(--ink)">E</text>
    <text y="112" font-size="17" font-family="var(--mono)" fill="${C}">euh</text>
    <text y="134" font-size="12" fill="var(--ink-3)" font-family="var(--body)">not “ee”</text>
  </g>
  <g transform="translate(300,0)">
    <rect x="-52" y="16" width="104" height="72" rx="10" fill="none" stroke="${C}" stroke-width="2"/>
    <text y="70" font-size="46" font-weight="800" fill="var(--ink)">G</text>
    <text y="112" font-size="17" font-family="var(--mono)" fill="${C}">zhay</text>
    <text y="134" font-size="12" fill="var(--ink-3)" font-family="var(--body)">French J sound</text>
  </g>
  <g transform="translate(500,0)">
    <rect x="-52" y="16" width="104" height="72" rx="10" fill="none" stroke="${C}" stroke-width="2"/>
    <text y="70" font-size="46" font-weight="800" fill="var(--ink)">W</text>
    <text y="112" font-size="17" font-family="var(--mono)" fill="${C}">doo-bluh-vay</text>
    <text y="134" font-size="12" fill="var(--ink-3)" font-family="var(--body)">“double V”</text>
  </g>
 </g>
</svg>`},

silent:{cap:"The feminine -e wakes the sleeping consonant",svg:`
<svg viewBox="0 0 600 168" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="français has a silent s, française pronounces it as z">
 <g text-anchor="middle" font-family="var(--display)">
  <g transform="translate(150,0)">
   <text y="58" font-size="34" font-weight="600" fill="var(--ink)">françai<tspan fill="var(--ink-3)">s</tspan></text>
   <line x1="42" y1="46" x2="70" y2="24" stroke="var(--ink-3)" stroke-width="2" stroke-linecap="round"/>
   <text y="88" font-size="15" font-family="var(--mono)" fill="var(--ink-3)">frahn-SAY</text>
   <text y="116" font-size="12" font-family="var(--body)" fill="var(--ink-3)">masculin · s muet</text>
  </g>
  <g transform="translate(300,52)" stroke="${C}" stroke-width="2" fill="none">
   <path d="M-24 0h44" stroke-linecap="round"/><path d="M14 -6l7 6-7 6" stroke-linecap="round" stroke-linejoin="round"/>
   <text y="26" font-size="11" font-family="var(--mono)" fill="${C}" stroke="none" text-anchor="middle">+ e</text>
  </g>
  <g transform="translate(452,0)">
   <text y="58" font-size="34" font-weight="600" fill="var(--ink)">françai<tspan fill="${C}">se</tspan></text>
   <circle cx="47" cy="47" r="21" fill="none" stroke="${C}" stroke-width="2"/>
   <text y="88" font-size="15" font-family="var(--mono)" fill="${C}">frahn-SEZ</text>
   <text y="116" font-size="12" font-family="var(--body)" fill="var(--ink-3)">féminin · s sonore</text>
  </g>
 </g>
 <text x="300" y="152" text-anchor="middle" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">You can hear the gender — that's the whole point of the extra letter.</text>
</svg>`},

seventy:{cap:"French counts 70, 80 and 90 with arithmetic",svg:`
<svg viewBox="0 0 600 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="70 equals 60 plus 10, 80 equals 4 times 20, 90 equals 4 times 20 plus 10">
 <g font-family="var(--mono)" font-size="13">
  <g transform="translate(0,10)">
   <text x="8" y="30" font-family="var(--display)" font-size="26" font-weight="800" fill="var(--ink)">70</text>
   <rect x="70" y="8" width="96" height="32" rx="7" fill="none" stroke="var(--rule)" stroke-width="1.5"/>
   <text x="118" y="29" text-anchor="middle" fill="var(--ink-2)">soixante</text>
   <text x="182" y="29" text-anchor="middle" fill="${C}" font-size="17">+</text>
   <rect x="198" y="8" width="60" height="32" rx="7" fill="none" stroke="var(--rule)" stroke-width="1.5"/>
   <text x="228" y="29" text-anchor="middle" fill="var(--ink-2)">dix</text>
   <text x="284" y="29" fill="var(--ink-3)">→</text>
   <text x="310" y="29" font-family="var(--display)" font-size="16" font-weight="600" fill="var(--ink)">soixante-dix</text>
  </g>
  <g transform="translate(0,72)">
   <text x="8" y="30" font-family="var(--display)" font-size="26" font-weight="800" fill="var(--ink)">80</text>
   <rect x="70" y="8" width="80" height="32" rx="7" fill="none" stroke="var(--rule)" stroke-width="1.5"/>
   <text x="110" y="29" text-anchor="middle" fill="var(--ink-2)">quatre</text>
   <text x="166" y="29" text-anchor="middle" fill="${C}" font-size="17">×</text>
   <rect x="182" y="8" width="64" height="32" rx="7" fill="none" stroke="var(--rule)" stroke-width="1.5"/>
   <text x="214" y="29" text-anchor="middle" fill="var(--ink-2)">vingt</text>
   <text x="284" y="29" fill="var(--ink-3)">→</text>
   <text x="310" y="29" font-family="var(--display)" font-size="16" font-weight="600" fill="var(--ink)">quatre-vingts</text>
  </g>
  <g transform="translate(0,134)">
   <text x="8" y="30" font-family="var(--display)" font-size="26" font-weight="800" fill="var(--ink)">90</text>
   <rect x="70" y="8" width="146" height="32" rx="7" fill="none" stroke="var(--rule)" stroke-width="1.5"/>
   <text x="143" y="29" text-anchor="middle" fill="var(--ink-2)">quatre-vingt</text>
   <text x="232" y="29" text-anchor="middle" fill="${C}" font-size="17">+</text>
   <rect x="248" y="8" width="52" height="32" rx="7" fill="none" stroke="var(--rule)" stroke-width="1.5"/>
   <text x="274" y="29" text-anchor="middle" fill="var(--ink-2)">dix</text>
   <text x="316" y="29" fill="var(--ink-3)">→</text>
   <text x="342" y="29" font-family="var(--display)" font-size="16" font-weight="600" fill="var(--ink)">quatre-vingt-dix</text>
  </g>
 </g>
 <text x="8" y="204" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Belgium and Switzerland say septante and nonante. Standard French does the maths.</text>
</svg>`},

hexagone:{cap:"L'Hexagone — the first two digits tell you where",svg:`
<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map of French phone area codes 01 to 05">
 <g transform="translate(150,20)">
  <path d="M120 0 L232 62 L232 190 L120 252 L8 190 L8 62 Z" fill="none" stroke="var(--rule)" stroke-width="2"/>
  <line x1="120" y1="0" x2="120" y2="252" stroke="var(--rule)" stroke-width="1.5"/>
  <line x1="8" y1="126" x2="232" y2="126" stroke="var(--rule)" stroke-width="1.5"/>
  <g font-family="var(--display)" font-weight="800" font-size="21" text-anchor="middle">
   <text x="64" y="72" fill="${C}">02</text>
   <text x="176" y="72" fill="${C}">03</text>
   <text x="64" y="192" fill="${C}">05</text>
   <text x="176" y="192" fill="${C}">04</text>
  </g>
  <circle cx="120" cy="90" r="21" fill="var(--card)" stroke="${C}" stroke-width="2"/>
  <text x="120" y="97" text-anchor="middle" font-family="var(--display)" font-weight="800" font-size="17" fill="${C}">01</text>
  <g font-family="var(--body)" font-size="10.5" fill="var(--ink-3)" text-anchor="middle">
   <text x="64" y="88">nord-ouest</text><text x="176" y="88">nord-est</text>
   <text x="64" y="208">sud-ouest</text><text x="176" y="208">sud-est</text>
   <text x="120" y="124">Paris</text>
  </g>
 </g>
 <g font-family="var(--mono)" font-size="12" fill="var(--ink-2)">
  <text x="10" y="40">06</text><text x="42" y="40" fill="var(--ink-3)">portable</text>
  <text x="10" y="62">07</text><text x="42" y="62" fill="var(--ink-3)">portable</text>
  <text x="10" y="90">08</text><text x="42" y="90" fill="var(--ink-3)">tarif spécial</text>
  <text x="10" y="112">09</text><text x="42" y="112" fill="var(--ink-3)">autre opérateur</text>
 </g>
 <text x="10" y="286" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Ten digits, always read in pairs: 06 40 08 85 96.</text>
</svg>`},

presenter:{cap:"The exchange every French course opens with",svg:`
<svg viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two speech bubbles introducing themselves">
 <g>
  <path d="M20 16 h258 a10 10 0 0 1 10 10 v62 a10 10 0 0 1 -10 10 h-206 l-24 22 v-22 h-28 a10 10 0 0 1 -10 -10 v-62 a10 10 0 0 1 10 -10 z" fill="var(--card)" stroke="${C}" stroke-width="2"/>
  <text x="42" y="52" font-family="var(--display)" font-size="19" font-weight="600" fill="var(--ink)">Bonjour, je m'appelle…</text>
  <text x="42" y="76" font-family="var(--mono)" font-size="12.5" fill="${C}">zhuh ma-PELL</text>
 </g>
 <g>
  <path d="M580 68 h-258 a10 10 0 0 0 -10 10 v62 a10 10 0 0 0 10 10 h206 l24 22 v-22 h28 a10 10 0 0 0 10 -10 v-62 a10 10 0 0 0 -10 -10 z" fill="var(--ink)" stroke="var(--ink)" stroke-width="2"/>
  <text x="558" y="104" text-anchor="end" font-family="var(--display)" font-size="19" font-weight="600" fill="#fff">Enchanté !</text>
  <text x="558" y="128" text-anchor="end" font-family="var(--mono)" font-size="12.5" fill="rgba(255,255,255,.65)">ahn-shahn-TAY</text>
 </g>
</svg>`},

tuvous:{cap:"When in doubt, vous is never rude",svg:`
<svg viewBox="0 0 600 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A scale from tu to vous">
 <line x1="60" y1="96" x2="540" y2="96" stroke="var(--rule)" stroke-width="3" stroke-linecap="round"/>
 <circle cx="60" cy="96" r="9" fill="${C}"/>
 <circle cx="540" cy="96" r="9" fill="var(--ink)"/>
 <text x="60" y="66" text-anchor="middle" font-family="var(--display)" font-size="27" font-weight="800" fill="${C}">tu</text>
 <text x="540" y="66" text-anchor="middle" font-family="var(--display)" font-size="27" font-weight="800" fill="var(--ink)">vous</text>
 <g font-family="var(--body)" font-size="12.5" fill="var(--ink-2)">
  <text x="60" y="126" text-anchor="middle">un ami</text>
  <text x="60" y="146" text-anchor="middle">la famille</text>
  <text x="60" y="166" text-anchor="middle">un enfant</text>
  <text x="540" y="126" text-anchor="middle">un inconnu</text>
  <text x="540" y="146" text-anchor="middle">madame / monsieur</text>
  <text x="540" y="166" text-anchor="middle">deux personnes ou plus</text>
 </g>
 <g transform="translate(300,96)">
  <rect x="-88" y="-18" width="176" height="36" rx="18" fill="var(--card)" stroke="var(--rule)" stroke-width="1.5"/>
  <text y="5" text-anchor="middle" font-family="var(--body)" font-size="12.5" fill="var(--ink-3)">pas sûr ? → vous</text>
 </g>
</svg>`},

quel:{cap:"Four spellings, one sound: kel",svg:`
<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="quel quelle quels quelles agreement table">
 <g font-family="var(--mono)" font-size="11.5" fill="var(--ink-3)">
  <text x="150" y="26" text-anchor="middle">MASCULIN</text>
  <text x="390" y="26" text-anchor="middle">FÉMININ</text>
  <text x="40" y="72" text-anchor="middle">SING.</text>
  <text x="40" y="140" text-anchor="middle">PLUR.</text>
 </g>
 <g>
  <rect x="76" y="40" width="148" height="46" rx="9" fill="var(--card)" stroke="${C}" stroke-width="1.6"/>
  <text x="150" y="70" text-anchor="middle" font-family="var(--display)" font-size="20" font-weight="600" fill="var(--ink)">quel</text>
  <rect x="316" y="40" width="148" height="46" rx="9" fill="var(--card)" stroke="${C}" stroke-width="1.6"/>
  <text x="390" y="70" text-anchor="middle" font-family="var(--display)" font-size="20" font-weight="600" fill="var(--ink)">quelle</text>
  <rect x="76" y="108" width="148" height="46" rx="9" fill="var(--card)" stroke="${C}" stroke-width="1.6"/>
  <text x="150" y="138" text-anchor="middle" font-family="var(--display)" font-size="20" font-weight="600" fill="var(--ink)">quels</text>
  <rect x="316" y="108" width="148" height="46" rx="9" fill="var(--card)" stroke="${C}" stroke-width="1.6"/>
  <text x="390" y="138" text-anchor="middle" font-family="var(--display)" font-size="20" font-weight="600" fill="var(--ink)">quelles</text>
 </g>
 <g transform="translate(524,97)">
  <circle r="34" fill="${C}"/>
  <text y="-2" text-anchor="middle" font-family="var(--mono)" font-size="15" fill="#fff">kel</text>
  <text y="16" text-anchor="middle" font-family="var(--body)" font-size="9.5" fill="rgba(255,255,255,.75)">toutes</text>
 </g>
 <text x="76" y="186" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Spelling changes to match the noun. The sound never does.</text>
</svg>`},

agreement:{cap:"Four forms, built from one word",svg:`
<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="grand grande grands grandes">
 <g font-family="var(--display)" font-size="23" font-weight="600">
  <text x="30" y="52" fill="var(--ink)">grand</text>
  <text x="30" y="104" fill="var(--ink)">grand<tspan fill="${C}">e</tspan></text>
  <text x="330" y="52" fill="var(--ink)">grand<tspan fill="${C}">s</tspan></text>
  <text x="330" y="104" fill="var(--ink)">grand<tspan fill="${C}">es</tspan></text>
 </g>
 <g font-family="var(--mono)" font-size="12">
  <text x="30" y="74" fill="var(--ink-3)">grahn · il est</text>
  <text x="30" y="126" fill="${C}">GRAHND · elle est</text>
  <text x="330" y="74" fill="var(--ink-3)">grahn · ils sont</text>
  <text x="330" y="126" fill="${C}">GRAHND · elles sont</text>
 </g>
 <line x1="30" y1="150" x2="570" y2="150" stroke="var(--rule)" stroke-width="1.5"/>
 <text x="30" y="176" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">The -s is always silent. Only the -e changes what you hear.</text>
</svg>`},

nepas:{cap:"The verb sits inside the sandwich",svg:`
<svg viewBox="0 0 600 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="ne plus verb plus pas structure">
 <g transform="translate(52,34)">
  <rect x="0" y="0" width="66" height="46" rx="9" fill="${C}"/>
  <text x="33" y="30" text-anchor="middle" font-family="var(--display)" font-size="20" font-weight="600" fill="#fff">ne</text>
  <rect x="78" y="0" width="164" height="46" rx="9" fill="var(--card)" stroke="var(--ink)" stroke-width="2"/>
  <text x="160" y="30" text-anchor="middle" font-family="var(--display)" font-size="20" font-weight="600" fill="var(--ink)">suis</text>
  <rect x="254" y="0" width="76" height="46" rx="9" fill="${C}"/>
  <text x="292" y="30" text-anchor="middle" font-family="var(--display)" font-size="20" font-weight="600" fill="#fff">pas</text>
  <text x="348" y="30" font-family="var(--display)" font-size="20" font-weight="600" fill="var(--ink-3)">content.</text>
  <text x="160" y="70" text-anchor="middle" font-family="var(--mono)" font-size="11" fill="var(--ink-3)">le verbe conjugué</text>
 </g>
 <text x="52" y="140" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Before a vowel, ne becomes n' : <tspan font-family="var(--mono)" fill="var(--ink)">elle n'est pas riche</tspan>.</text>
</svg>`},

bise:{cap:"Three ways to say hello without a word",svg:`
<svg viewBox="0 0 600 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="handshake, cheek kiss and wave">
 <g fill="none" stroke="${C}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <g transform="translate(100,44)">
    <path d="M-34 8 h22 l10 -8 12 10 12 -10 10 8 h22"/>
    <path d="M-12 8 l14 12 12 -12"/>
  </g>
  <g transform="translate(300,44)">
    <circle cx="-16" cy="4" r="15"/><circle cx="16" cy="4" r="15"/>
    <path d="M-2 4 h4" stroke-width="2.5"/>
  </g>
  <g transform="translate(500,44)">
    <path d="M0 22 v-24"/><path d="M-10 12 c-4 -12 4 -20 10 -20 6 0 14 8 10 20"/>
    <path d="M-14 -8 l-6 -8 M14 -8 l6 -8"/>
  </g>
 </g>
 <g font-family="var(--display)" font-size="15" font-weight="600" text-anchor="middle" fill="var(--ink)">
  <text x="100" y="104">Serrer la main</text>
  <text x="300" y="104">Faire la bise</text>
  <text x="500" y="104">Faire un signe</text>
 </g>
 <g font-family="var(--body)" font-size="11.5" text-anchor="middle" fill="var(--ink-3)">
  <text x="100" y="126">surtout entre hommes</text>
  <text x="300" y="126">amies, collègues, enfants</text>
  <text x="500" y="126">de loin, à un groupe</text>
 </g>
 <text x="300" y="158" text-anchor="middle" font-size="12" font-family="var(--body)" fill="var(--ink-2)">Two, three or four bises — it depends entirely on the region.</text>
</svg>`},

tree:{cap:"Every in-law word comes off this one tree",svg:`
<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Family tree of Victor, Jeanne, Marc, Caroline, Véronique, Denis and their children">
 <g stroke="var(--rule)" stroke-width="2" fill="none">
  <path d="M300 46 v22"/>
  <path d="M170 68 h260"/>
  <path d="M170 68 v26 M430 68 v26"/>
  <path d="M118 150 h104 M378 150 h104"/>
  <path d="M148 150 v26 M192 150 v26 M430 150 v26"/>
 </g>
 <g font-family="var(--body)" font-size="12.5" text-anchor="middle">
  <g transform="translate(300,20)">
   <rect x="-104" y="-16" width="208" height="30" rx="15" fill="var(--ink)"/>
   <text y="4" fill="#fff" font-weight="600">Victor  ♥  Jeanne</text>
   <text y="34" font-size="10.5" font-family="var(--mono)" fill="var(--ink-3)">LES GRANDS-PARENTS</text>
  </g>
  <g transform="translate(170,118)">
   <rect x="-88" y="-17" width="176" height="30" rx="15" fill="var(--card)" stroke="${C}" stroke-width="1.8"/>
   <text y="3" fill="var(--ink)" font-weight="600">Marc  ♥  Caroline</text>
  </g>
  <g transform="translate(430,118)">
   <rect x="-92" y="-17" width="184" height="30" rx="15" fill="var(--card)" stroke="${C}" stroke-width="1.8"/>
   <text y="3" fill="var(--ink)" font-weight="600">Véronique  ♥  Denis</text>
  </g>
  <g transform="translate(148,196)"><rect x="-44" y="-16" width="88" height="28" rx="14" fill="var(--card)" stroke="var(--rule)" stroke-width="1.5"/><text y="3" fill="var(--ink-2)">Ariane</text></g>
  <g transform="translate(244,196)"><rect x="-40" y="-16" width="80" height="28" rx="14" fill="var(--card)" stroke="var(--rule)" stroke-width="1.5"/><text y="3" fill="var(--ink-2)">Félix</text></g>
  <g transform="translate(430,196)"><rect x="-48" y="-16" width="96" height="28" rx="14" fill="var(--card)" stroke="var(--rule)" stroke-width="1.5"/><text y="3" fill="var(--ink-2)">Nicolas</text></g>
 </g>
 <g font-family="var(--mono)" font-size="10.5" fill="var(--ink-3)">
  <text x="300" y="238" text-anchor="middle">LES PETITS-ENFANTS</text>
 </g>
 <g font-family="var(--body)" font-size="12" fill="var(--ink-2)">
  <text x="20" y="270">Caroline est la <tspan font-weight="600" fill="var(--ink)">belle-fille</tspan> de Victor · Denis est son <tspan font-weight="600" fill="var(--ink)">gendre</tspan></text>
  <text x="20" y="290">Marc est l'<tspan font-weight="600" fill="var(--ink)">oncle</tspan> de Nicolas · Ariane est la <tspan font-weight="600" fill="var(--ink)">nièce</tspan> de Véronique</text>
 </g>
</svg>`},

aimer:{cap:"One verb, four temperatures",svg:`
<svg viewBox="0 0 600 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Intensity ladder of the verb aimer">
 <g>
  <rect x="30" y="128" width="120" height="34" rx="8" fill="var(--card)" stroke="var(--rule)" stroke-width="1.6"/>
  <rect x="166" y="100" width="120" height="62" rx="8" fill="var(--card)" stroke="${C}" stroke-width="1.6" opacity=".55"/>
  <rect x="302" y="64" width="120" height="98" rx="8" fill="${C}" opacity=".22"/>
  <rect x="438" y="30" width="132" height="132" rx="8" fill="${C}"/>
 </g>
 <g font-family="var(--display)" font-size="14.5" font-weight="600" text-anchor="middle">
  <text x="90" y="150" fill="var(--ink)">aime bien</text>
  <text x="226" y="136" fill="var(--ink)">aime beaucoup</text>
  <text x="362" y="120" fill="var(--ink)">aime</text>
  <text x="504" y="104" fill="#fff">adore</text>
 </g>
 <g font-family="var(--body)" font-size="11.5" text-anchor="middle" fill="var(--ink-3)">
  <text x="90" y="182">un copain</text>
  <text x="226" y="182">un grand ami</text>
  <text x="362" y="182">l'amour</text>
  <text x="504" y="182">les choses</text>
 </g>
 <text x="30" y="204" font-size="12.5" font-family="var(--body)" fill="var(--ink-2)">Say bare <tspan font-family="var(--mono)" fill="var(--ink)">j'aime</tspan> about a friend and it lands as a declaration.</text>
</svg>`}

};
