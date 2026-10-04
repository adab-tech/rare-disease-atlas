export type NodeType = 'disease' | 'gene' | 'variant' | 'mechanism' | 'phenotype' | 'trial' | 'organization' | 'asset' | 'researcher';
export type Cluster = 'clearance' | 'channel';
export type AtlasNode = { id: string; label: string; type: NodeType; cluster: Cluster; subtitle: string; description: string; aliases?: string[]; source?: string | undefined; url?: string | undefined };
export type AtlasEdge = { id: string; source: string; target: string; relation: string; explanation: string; confidence: number; status: 'Observed' | 'Inferred'; sourceRef: string; sourceUrl?: string | undefined; caveat?: string | undefined };

const n = (id: string, label: string, type: NodeType, cluster: Cluster, subtitle: string, description: string, aliases: string[] = [], source?: string, url?: string): AtlasNode => ({ id, label, type, cluster, subtitle, description, aliases, source, url });
export const nodes: AtlasNode[] = [
  n('npc','Niemann–Pick type C','disease','clearance','Lysosomal storage disorder','A rare inherited condition in which cells struggle to move cholesterol and other fats out of their storage compartments.',['Niemann-Pick','Niemann Pick','NPC','NPC disease'],'OMIM:257220'),
  n('gaucher','Gaucher disease','disease','clearance','Lysosomal storage disorder','An inherited condition in which an enzyme deficit causes fatty material to build up in cells.',['Gaucher','GD'],'OMIM:230800'),
  n('fabry','Fabry disease','disease','clearance','Lysosomal storage disorder','An inherited condition affecting the breakdown of certain fats; included as a neighboring pathway, not an identical mechanism.',['Anderson-Fabry'],'OMIM:301500'),
  n('dravet','Dravet syndrome','disease','channel','Epileptic encephalopathy','A severe epilepsy often beginning in infancy, commonly associated with changes in the SCN1A gene.',['Severe myoclonic epilepsy of infancy'],'OMIM:607208'),
  n('scn2a-d','SCN2A-related disorder','disease','channel','Epileptic encephalopathy','A range of neurological conditions associated with changes in SCN2A; the effect of a specific variant matters.',['SCN2A encephalopathy'],'OMIM:613721'),
  n('scn8a-d','SCN8A-related epilepsy','disease','channel','Epileptic encephalopathy','An epilepsy associated with SCN8A changes; clinical presentation and treatment response vary by variant.',['SCN8A encephalopathy'],'OMIM:614558'),
  n('kcnq2-d','KCNQ2-related epilepsy','disease','channel','Epileptic encephalopathy','An early-onset epilepsy connected to changes in a potassium-channel gene.',['KCNQ2 encephalopathy'],'OMIM:613720'),
  n('npc1','NPC1','gene','clearance','Cholesterol transport gene','Encodes a protein involved in moving cholesterol out of the lysosome.',['NPC-1'],'OMIM:607623'),
  n('npc2','NPC2','gene','clearance','Cholesterol transport gene','Encodes a soluble protein that helps shuttle cholesterol inside the lysosome.',['HE1'],'OMIM:601015'),
  n('gba1','GBA1','gene','clearance','Lysosomal enzyme gene','Encodes glucocerebrosidase, an enzyme involved in lipid breakdown.',['GBA'],'OMIM:606463'),
  n('gla','GLA','gene','clearance','Lysosomal enzyme gene','Encodes alpha-galactosidase A, involved in breaking down certain lipids.',['Alpha-galactosidase A'],'OMIM:300644'),
  n('scn1a','SCN1A','gene','channel','Sodium channel gene','Encodes a sodium channel subunit important for electrical signaling in nerve cells.',['Nav1.1'],'OMIM:182389'),
  n('scn2a','SCN2A','gene','channel','Sodium channel gene','Encodes a sodium channel subunit; different variants can change channel activity in different directions.',['Nav1.2'],'OMIM:182390'),
  n('scn8a','SCN8A','gene','channel','Sodium channel gene','Encodes a sodium channel subunit involved in nerve-cell firing.',['Nav1.6'],'OMIM:600702'),
  n('kcnq2','KCNQ2','gene','channel','Potassium channel gene','Encodes part of a potassium channel that helps regulate electrical excitability.',['Kv7.2'],'OMIM:602235'),
  n('npc1-var','NPC1 variant','variant','clearance','Illustrative variant class','Loss-of-function variants can impair intracellular cholesterol transport. Specific variants need individual review.',['NPC1 loss of function'],'ClinVar (demo)'),
  n('gba1-var','GBA1 variant','variant','clearance','Illustrative variant class','Reduced enzyme activity can drive accumulation of glucosylceramide.',['GBA1 loss of function'],'ClinVar (demo)'),
  n('scn1a-var','SCN1A variant','variant','channel','Illustrative variant class','Loss-of-function is a common disease mechanism in Dravet syndrome; not every variant behaves the same way.',['SCN1A loss of function'],'ClinVar (demo)'),
  n('scn2a-var','SCN2A variant','variant','channel','Illustrative variant class','Some variants raise and others lower channel activity. Variant-level interpretation is essential.',['SCN2A gain of function'],'ClinVar (demo)'),
  n('scn8a-var','SCN8A variant','variant','channel','Illustrative variant class','Many disease-associated variants alter sodium-channel activity.',['SCN8A gain of function'],'ClinVar (demo)'),
  n('lipid','Lipid clearance','mechanism','clearance','Shared biological pathway','The movement and breakdown of fats within the cell’s recycling compartments. A shared theme, not proof of shared treatment.',['lipid accumulation','lysosomal storage','lysosomal lipid clearance','autophagy'],'Mechanism synthesis (demo)'),
  n('autophagy','Autophagy disruption','mechanism','clearance','Related biological process','A possible downstream effect when the cell’s recycling system is stressed. The causal link varies by disease.',['autophagy defects'],'Mechanism synthesis (demo)'),
  n('sodium','Sodium channel dysfunction','mechanism','channel','Shared biological pathway','Changes in nerve-cell sodium signaling connect several epilepsies, but variant effects may point to opposite treatment strategies.',['sodium channelopathy','channelopathy','neuronal excitability'],'Mechanism synthesis (demo)'),
  n('potassium','Potassium channel dysfunction','mechanism','channel','Related biological pathway','Changes in potassium signaling can also affect neuronal excitability, by a different route.',['potassium channelopathy'],'Mechanism synthesis (demo)'),
  n('ataxia','Ataxia','phenotype','clearance','HPO:0001251','Difficulty coordinating movement; seen in several neurological conditions.',['unsteady walking','coordination problems'],'HPO:0001251'),
  n('splenomegaly','Splenomegaly','phenotype','clearance','HPO:0001744','An enlarged spleen, which can appear in some lysosomal storage disorders.',['enlarged spleen'],'HPO:0001744'),
  n('seizures','Seizures','phenotype','channel','HPO:0001250','Episodes caused by abnormal electrical activity in the brain. A broad symptom with many possible causes.',['epilepsy','convulsions'],'HPO:0001250'),
  n('delay','Developmental delay','phenotype','channel','HPO:0001263','Developmental milestones reached later than expected; not specific to one condition.',['delayed development'],'HPO:0001263'),
  n('npc-trial','NPC natural history study','trial','clearance','Clinical study · demo NCT ID','Illustrative natural-history study record; confirm the actual study, eligibility, and status before acting.',['NPC trial'],'NCT00000001 (demo)'),
  n('gaucher-trial','Gaucher outcomes study','trial','clearance','Clinical study · demo NCT ID','Illustrative study record that could inform outcome measures across a related research area.',['Gaucher study'],'NCT00000002 (demo)'),
  n('dravet-trial','Dravet interventional study','trial','channel','Clinical study · demo NCT ID','Illustrative clinical study record; no eligibility or treatment implication is established here.',['Dravet trial'],'NCT00000003 (demo)'),
  n('scn2a-trial','SCN2A natural history study','trial','channel','Clinical study · demo NCT ID','Illustrative study design that might inform how a patient community tracks change over time.',['SCN2A trial'],'NCT00000004 (demo)'),
  n('nnpc','National Niemann-Pick Disease Foundation','organization','clearance','Patient community','An existing community for families affected by Niemann–Pick diseases.',['NNPDF','Niemann-Pick Foundation'],'Patient organization', 'https://nnpdf.org'),
  n('gaucher-org','National Gaucher Foundation','organization','clearance','Patient community','A patient organization supporting families and research in Gaucher disease.',['NGF'],'Patient organization','https://www.gaucherdisease.org'),
  n('dravet-org','Dravet Syndrome Foundation','organization','channel','Patient community','A patient organization connecting families, clinicians, and research.',['DSF'],'Patient organization','https://dravetfoundation.org'),
  n('scn2a-org','FamilieSCN2A Foundation','organization','channel','Patient community','A patient-led organization supporting the SCN2A community.',['FamilieSCN2A'],'Patient organization','https://www.scn2a.org'),
  n('npc-reg','NPC patient registry','asset','clearance','Registry · illustrative','A proposed reusable registry pattern for collecting longitudinal patient information. Verify access and permissions with the organization.',['NPC registry','registry template'],'Illustrative asset'),
  n('gaucher-model','Gaucher animal model','asset','clearance','Preclinical model · illustrative','A model category for studying lysosomal enzyme deficiency; model suitability needs expert assessment.',['Gaucher mouse model'],'Illustrative asset'),
  n('dravet-reg','Dravet patient registry','asset','channel','Registry · illustrative','A model for structured natural-history data collection. Reuse requires consent, governance, and clinical review.',['Dravet registry'],'Illustrative asset'),
  n('scn2a-model','SCN2A neuronal model','asset','channel','Cell model · illustrative','Patient-derived neuronal models may help test variant-specific channel effects.',['SCN2A cell model'],'Illustrative asset'),
  n('patterson','Marc Patterson','researcher','clearance','NPC clinical research','Clinician-researcher known for work in Niemann–Pick type C. Collaboration availability is not verified.',['Dr. Marc Patterson'],'Researcher profile (demo)'),
  n('pastores','Gregory Pastores','researcher','clearance','Lysosomal disease research','Clinician-researcher associated with lysosomal storage diseases. Collaboration availability is not verified.',['Dr. Gregory Pastores'],'Researcher profile (demo)'),
  n('platt','Frances Platt','researcher','clearance','Lysosomal biology','Researcher known for work on lysosomal storage disorders. Collaboration availability is not verified.',['Prof. Frances Platt'],'Researcher profile (demo)'),
  n('meisler','Miriam Meisler','researcher','channel','Sodium channel genetics','Researcher known for work on sodium channel genes and epilepsy. Collaboration availability is not verified.',['Dr. Miriam Meisler'],'Researcher profile (demo)'),
  n('scheffer','Ingrid Scheffer','researcher','channel','Epilepsy genetics','Clinician-researcher known for epilepsy genetics. Collaboration availability is not verified.',['Prof. Ingrid Scheffer'],'Researcher profile (demo)'),
  n('wagnon','John Wagnon','researcher','channel','SCN8A research','Researcher associated with sodium-channel epilepsy studies. Collaboration availability is not verified.',['Dr. John Wagnon'],'Researcher profile (demo)'),
];

const e = (source: string, target: string, relation: string, explanation: string, confidence: number, status: 'Observed' | 'Inferred', sourceRef: string, caveat?: string): AtlasEdge => ({ id: `${source}-${target}`, source, target, relation, explanation, confidence, status, sourceRef, caveat });
export const edges: AtlasEdge[] = [
  e('npc','npc1','associated with','Changes in NPC1 are a well-established cause of Niemann–Pick type C.',.97,'Observed','OMIM:257220'),
  e('npc','npc2','associated with','NPC2 changes can also cause Niemann–Pick type C.',.94,'Observed','OMIM:607625'),
  e('gaucher','gba1','associated with','GBA1 changes cause Gaucher disease.',.98,'Observed','OMIM:230800'),
  e('fabry','gla','associated with','GLA changes cause Fabry disease.',.98,'Observed','OMIM:301500'),
  e('dravet','scn1a','associated with','SCN1A is the principal gene associated with Dravet syndrome.',.98,'Observed','OMIM:607208'),
  e('scn2a-d','scn2a','associated with','SCN2A variants are associated with a spectrum of neurological disorders.',.97,'Observed','OMIM:613721'),
  e('scn8a-d','scn8a','associated with','SCN8A variants are associated with early-onset epilepsy.',.96,'Observed','OMIM:614558'),
  e('kcnq2-d','kcnq2','associated with','KCNQ2 variants are associated with early-onset epilepsy.',.97,'Observed','OMIM:613720'),
  e('npc1','npc1-var','has variant class','This simplified variant class represents changes that impair NPC1 function.',.82,'Inferred','ClinVar (demo)','Specific variants must be reviewed individually.'),
  e('gba1','gba1-var','has variant class','This simplified variant class represents reduced enzyme activity.',.82,'Inferred','ClinVar (demo)','Specific variants must be reviewed individually.'),
  e('scn1a','scn1a-var','has variant class','Loss of function is a common, but not universal, Dravet mechanism.',.89,'Observed','OMIM:607208','Not every SCN1A variant has the same functional effect.'),
  e('scn2a','scn2a-var','has variant class','Some SCN2A variants increase channel activity.',.78,'Observed','OMIM:613721','Other SCN2A variants reduce activity, which can change treatment logic.'),
  e('scn8a','scn8a-var','has variant class','Some SCN8A variants change channel activity.',.78,'Observed','OMIM:614558','Functional direction differs across variants.'),
  e('npc1','lipid','disrupts','NPC1 helps transport cholesterol; impaired function can cause lysosomal accumulation.',.94,'Observed','OMIM:607623'),
  e('npc2','lipid','disrupts','NPC2 participates in lysosomal cholesterol transport.',.9,'Observed','OMIM:601015'),
  e('gba1','lipid','disrupts','Reduced GBA1 enzyme activity can lead to lipid accumulation.',.95,'Observed','OMIM:606463'),
  e('gla','lipid','shares broad pathway','Fabry also involves lysosomal lipid storage, but the substrate and precise mechanism differ.',.72,'Inferred','OMIM:300644','A shared lysosomal label is not evidence that the same treatment will work.'),
  e('lipid','autophagy','may affect','Storage stress may disrupt cellular recycling.',.64,'Inferred','PMID:30000001 (demo)','The direction and clinical significance differ across disorders.'),
  e('scn1a','sodium','affects','SCN1A encodes a sodium channel important for nerve-cell signaling.',.96,'Observed','OMIM:182389'),
  e('scn2a','sodium','affects','SCN2A encodes a sodium channel with variant-dependent functional effects.',.96,'Observed','OMIM:182390','Gain- and loss-of-function variants may need different approaches.'),
  e('scn8a','sodium','affects','SCN8A encodes a sodium channel associated with epilepsy.',.95,'Observed','OMIM:600702'),
  e('kcnq2','potassium','affects','KCNQ2 encodes a potassium channel; its mechanism is related to excitability but is not a sodium-channel defect.',.94,'Observed','OMIM:602235'),
  e('potassium','sodium','converges on excitability','Both channel types influence how easily neurons fire, but they are not interchangeable therapeutic targets.',.65,'Inferred','PMID:30000002 (demo)','A medicine acting on one channel may not help disorders in the other group.'),
  e('npc','ataxia','has phenotype','Difficulty coordinating movement can be part of Niemann–Pick type C.',.88,'Observed','HPO:0001251'),
  e('gaucher','splenomegaly','has phenotype','An enlarged spleen is a recognized feature of Gaucher disease.',.92,'Observed','HPO:0001744'),
  e('npc','splenomegaly','has phenotype','An enlarged spleen can also occur in Niemann–Pick type C.',.84,'Observed','HPO:0001744'),
  e('dravet','seizures','has phenotype','Seizures are a defining feature of Dravet syndrome.',.98,'Observed','HPO:0001250'),
  e('scn2a-d','seizures','has phenotype','Seizures occur in some SCN2A-related presentations.',.87,'Observed','HPO:0001250','The condition has a broad spectrum; not all patients have the same symptoms.'),
  e('scn8a-d','seizures','has phenotype','Seizures are common in SCN8A-related epilepsy.',.93,'Observed','HPO:0001250'),
  e('kcnq2-d','seizures','has phenotype','Early-onset seizures are associated with KCNQ2-related epilepsy.',.92,'Observed','HPO:0001250'),
  e('dravet','delay','has phenotype','Developmental differences can emerge over time.',.86,'Observed','HPO:0001263'),
  e('scn2a-d','delay','has phenotype','Developmental delay can be part of the SCN2A spectrum.',.84,'Observed','HPO:0001263'),
  e('npc','npc-trial','studied in','This illustrative natural-history record shows how a study might connect to NPC.',.6,'Inferred','NCT00000001 (demo)','Demo identifier, not a verified live trial.'),
  e('gaucher','gaucher-trial','studied in','Illustrative outcomes study for Gaucher disease.',.6,'Inferred','NCT00000002 (demo)','Demo identifier, not a verified live trial.'),
  e('dravet','dravet-trial','studied in','Illustrative interventional study for Dravet syndrome.',.6,'Inferred','NCT00000003 (demo)','Demo identifier, not a verified live trial.'),
  e('scn2a-d','scn2a-trial','studied in','Illustrative natural-history study for SCN2A-related disorders.',.6,'Inferred','NCT00000004 (demo)','Demo identifier, not a verified live trial.'),
  e('npc','nnpc','supported by','This patient organization supports the Niemann–Pick community.',.9,'Observed','nnpdf.org'),
  e('gaucher','gaucher-org','supported by','This organization serves the Gaucher community.',.9,'Observed','gaucherdisease.org'),
  e('dravet','dravet-org','supported by','This organization supports Dravet families.',.9,'Observed','dravetfoundation.org'),
  e('scn2a-d','scn2a-org','supported by','This organization supports the SCN2A community.',.9,'Observed','scn2a.org'),
  e('nnpc','npc-reg','may maintain','An illustrative registry connection; check with the organization whether data can be shared.',.55,'Inferred','Illustrative asset','Registry ownership, access, and reuse have not been verified.'),
  e('gaucher-org','gaucher-model','may inform','A potential research model category, not a confirmed organizational asset.',.48,'Inferred','Illustrative asset','Ownership and fitness for NPC research are unverified.'),
  e('dravet-org','dravet-reg','may maintain','An illustrative registry connection to explore with the organization.',.55,'Inferred','Illustrative asset','Access and permissions have not been verified.'),
  e('scn2a-org','scn2a-model','may inform','An illustrative cell-model opportunity for variant-specific work.',.5,'Inferred','Illustrative asset','Model availability and transfer terms are unverified.'),
  e('patterson','npc','studies','Marc Patterson is known for clinical work in NPC.',.84,'Observed','PMID:30000003 (demo)','Citation is illustrative; confirm publication before outreach.'),
  e('pastores','gaucher','studies','Gregory Pastores is associated with lysosomal disease research.',.81,'Observed','PMID:30000004 (demo)','Citation is illustrative; confirm publication before outreach.'),
  e('platt','lipid','studies','Frances Platt works on lysosomal disease biology.',.83,'Observed','PMID:30000005 (demo)','Citation is illustrative; confirm publication before outreach.'),
  e('meisler','scn8a','studies','Miriam Meisler is associated with sodium-channel genetics.',.83,'Observed','PMID:30000006 (demo)','Citation is illustrative; confirm publication before outreach.'),
  e('scheffer','dravet','studies','Ingrid Scheffer is known for epilepsy genetics research.',.86,'Observed','PMID:30000007 (demo)','Citation is illustrative; confirm publication before outreach.'),
  e('wagnon','scn8a-d','studies','John Wagnon is associated with SCN8A epilepsy research.',.8,'Observed','PMID:30000008 (demo)','Citation is illustrative; confirm publication before outreach.'),
];
export const nodeById = Object.fromEntries(nodes.map(node => [node.id, node])) as Record<string, AtlasNode>;
export const typeLabel: Record<NodeType, string> = { disease:'Disease', gene:'Gene', variant:'Variant', mechanism:'Mechanism', phenotype:'Phenotype', trial:'Clinical study', organization:'Patient group', asset:'Research asset', researcher:'Researcher' };
export const normalize = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
export function searchNodes(query: string) {
  const q = normalize(query.trim());
  if (!q) return [];
  return nodes.map(node => {
    const terms = [node.label, ...(node.aliases ?? []), node.subtitle, node.description];
    const match = terms.find(term => normalize(term) === q) ?? terms.find(term => normalize(term).startsWith(q)) ?? terms.find(term => normalize(term).includes(q));
    return match ? { node, matched: match, score: normalize(match) === q ? 0 : normalize(match).startsWith(q) ? 1 : 2 } : null;
  }).filter((item): item is {node: AtlasNode; matched: string; score: number} => item !== null).sort((a,b) => a.score - b.score || a.node.label.localeCompare(b.node.label)).slice(0,8);
}

export function getNode(id: string): AtlasNode { const node = nodeById[id]; if (!node) throw new Error(`Unknown atlas node: ${id}`); return node; }
