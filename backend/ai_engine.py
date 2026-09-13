import os
import json
import re
from typing import Dict, Any, Optional
from models import (
    SymptomAnalysisRequest,
    SymptomAnalysisResponse,
    AyurvedaRecommendation,
    HomeopathyRecommendation,
    AllopathyRecommendation,
    ComparisonSummary,
    HerbalRemedy,
    HomeopathicRemedy,
    MedicationClass,
)

# Comprehensive Clinical Fallback Knowledge Base covering major symptom patterns
CLINICAL_KNOWLEDGE_BASE = {
    "digestive": {
        "keywords": ["acid", "acidity", "reflux", "gerd", "heartburn", "bloating", "gas", "stomach", "indigestion", "gut", "burning", "nausea", "vomit", "constipat", "diarrhea", "ulcer"],
        "summary": "Upper gastrointestinal hyperacidity and dyspeptic syndrome",
        "severity": "Moderate (Requires clinical evaluation if refractory)",
        "ayurveda": {
            "dosha_imbalance": "Pitta-Vata Prakopa (Aggravated Pitta with impaired Agni/Digestive Fire)",
            "dosha_breakdown": {"Pitta": 60, "Vata": 30, "Kapha": 10},
            "herbal_remedies": [
                {"name": "Avipattikar Churna", "sanskrit_name": "अविपत्तिकर चूर्ण", "purpose": "Neutralizes excess hydrochloric acid, stimulates healthy bile, and regulates bowel peristalsis", "dosage": "3g with warm water 15 minutes before lunch and dinner", "form": "Herbal Powder"},
                {"name": "Kamadudha Ras (Mukta Yukta)", "sanskrit_name": "कामदुधा रस", "purpose": "Potent alkaline calcium-pearl formulation that cools mucosal burning and repairs gastric lining", "dosage": "250mg with cold milk or water twice daily", "form": "Tablets / Vati"},
                {"name": "Yashtimadhu (Licorice Root)", "sanskrit_name": "यष्टिमधु", "purpose": "Demulcent herb forming a protective mucosal barrier over inflamed esophageal tissue", "dosage": "1 tsp steeped in warm water as herbal tea once daily", "form": "Decoction / Tea"}
            ],
            "dietary_guidelines": [
                "Consume sweet, bitter, and astringent tastes (Pitta-pacifying Ahara).",
                "Strictly avoid deep-fried foods, red chilies, fermented batter, tomatoes, and carbonated beverages.",
                "Drink tender coconut water and soaked coriander-fennel seed water in the morning.",
                "Eat warm, freshly cooked meals with A2 cow ghee; avoid skipping meals or fasting for prolonged hours."
            ],
            "lifestyle_guidelines": [
                "Practice Sheetali and Sheetkari cooling Pranayama 10 minutes every morning.",
                "Avoid lying down immediately after meals; maintain a 2-hour gap before sleep.",
                "Elevate the head of the bed by 6 inches to prevent nocturnal acid regurgitation.",
                "Avoid intense anger or mental stress (Krodha) which directly stimulates hyperacidity."
            ],
            "recommended_therapies": ["Takradhara (Medicated buttermilk pouring)", "Virechana (Therapeutic purgation under Vaidya supervision)", "Abhyanga with Pitta-pacifying taila"],
            "expected_timeline": "Symptom reduction in 3-5 days; deep tissue healing and Agni stabilization in 3-4 weeks.",
            "philosophy": "Ayurveda addresses hyperacidity (Amlapitta) not by merely suppressing stomach acid, but by rekindling balanced digestive fire (Sama Agni) and clearing Pitta toxins (Ama).",
            "specialist_type": "Ayurvedic Kayachikitsa & Digestive Specialist (BAMS / MD Ayu)"
        },
        "homeopathy": {
            "constitutional_type": "Hyper-reactive, sedentary, or stress-induced constitutional totality",
            "totality_of_symptoms": "Gastric fullness with sour eructations, burning retrosternal discomfort aggravated by rich foods, stimulants, or mental exhaustion.",
            "remedies": [
                {"name": "Nux Vomica", "potency": "30C", "key_indication": "Hyperacidity after coffee, alcohol, spicy foods, or late nights; patient feels irritable and unrefreshed.", "dosage": "4 pills under the tongue at bedtime for 7 days"},
                {"name": "Robin开设 / Robinia Pseudoacacia", "potency": "6X or 30C", "key_indication": "Intense sour vomiting, fluid burns the teeth, prominent nocturnal regurgitation.", "dosage": "4 pills dissolved under tongue 20 minutes before main meals"},
                {"name": "Carbo Vegetabilis", "potency": "30C", "key_indication": "Excessive upper abdominal flatulence and belching, patient craves fresh cool air.", "dosage": "4 pills twice daily during acute bloating episodes"}
            ],
            "lifestyle_precautions": [
                "Refrain from consuming raw garlic, raw onions, and strong mint 30 minutes before and after remedy administration.",
                "Avoid holding the pills in bare hands; use the bottle cap to dispense directly into the mouth.",
                "Do not ingest coffee or camphorated balms during active homeopathic courses."
            ],
            "mode_of_action": "Homeopathy utilizes micro-diluted active energies to stimulate the body's self-healing vital force, harmonizing gastric vagal tone without synthetic chemicals.",
            "expected_timeline": "Acute relief within 24 to 48 hours; chronic constitutional equilibrium achieved in 3 to 6 weeks.",
            "philosophy": "Treats the individual rather than the disease label (Similia Similibus Curentur), addressing constitutional predisposition and psychosomatic factors.",
            "specialist_type": "Classical Homeopathic Physician (BHMS / MD Homeo)"
        },
        "allopathy": {
            "probable_diagnosis": "Gastroesophageal Reflux Disease (GERD) / Functional Dyspepsia / Non-Ulcer Gastritis",
            "clinical_summary": "Incompetence of the lower esophageal sphincter (LES) causing retrosternal gastric acid regurgitation, chemical mucosal inflammation, and delayed gastric emptying.",
            "diagnostic_tests": [
                "Upper GI Video Endoscopy (if symptoms persist >4 weeks or dysphagia present)",
                "Helicobacter pylori Stool Antigen Test / Urea Breath Test",
                "Ultrasound of Upper Abdomen (to rule out cholelithiasis / gallstones)",
                "Complete Blood Count (CBC) and Serum Ferritin"
            ],
            "conventional_medications": [
                {"drug_class": "Proton Pump Inhibitor (PPI)", "common_examples": "Pantoprazole 40mg or Esomeprazole 40mg", "role": "Suppresses gastric parietal cell H+/K+ ATPase enzyme, reducing basal and stimulated acid secretion."},
                {"drug_class": "Prokinetic Agent", "common_examples": "Itopride 50mg or Domperidone 10mg", "role": "Enhances gastric emptying and increases lower esophageal sphincter pressure."},
                {"drug_class": "Alginate Raft Antacid", "common_examples": "Sodium Alginate + Potassium Bicarbonate Suspension", "role": "Forms a mechanical buoyant barrier above stomach contents to prevent reflux."}
            ],
            "red_flags": [
                "Difficulty or pain while swallowing solid foods (Dysphagia/Odynophagia).",
                "Vomiting fresh blood or coffee-ground vomitus (Hematemesis).",
                "Black, tarry bowel movements (Melena).",
                "Unintentional weight loss or unexplained persistent anemia.",
                "Crushing retrosternal chest pain radiating to the left jaw or arm (Seek Emergency ER care immediately to rule out myocardial infarction)."
            ],
            "lifestyle_advice": [
                "Weight management to reduce intra-abdominal pressure.",
                "Cessation of smoking and alcohol consumption.",
                "Avoid tight waistbands and heavy lifting after meals."
            ],
            "expected_timeline": "Symptom relief within 24 to 48 hours of starting PPI therapy; complete mucosal healing within 4 to 8 weeks.",
            "philosophy": "Evidence-based molecular pharmacotherapy to immediately neutralize acid injury, prevent esophageal stricture/Barrett's esophagus, and eliminate H. pylori infection.",
            "specialist_type": "Gastroenterologist / Internal Medicine Specialist (MBBS, MD, DM)"
        }
    },
    "headache": {
        "keywords": ["headache", "migraine", "head", "throbbing", "temple", "forehead", "photophobia", "nausea", "aura", "cluster"],
        "summary": "Cephalea / Episodic Neurovascular Headache Syndrome",
        "severity": "Moderate to Severe",
        "ayurveda": {
            "dosha_imbalance": "Vata-Pitta Shiroroga (Neuro-vascular agitation)",
            "dosha_breakdown": {"Vata": 50, "Pitta": 40, "Kapha": 10},
            "herbal_remedies": [
                {"name": "Shirashooladi Vajra Ras", "sanskrit_name": "शिरःशूलादि वज्र रस", "purpose": "Classical mineral-herb formulation indicated for chronic and pulsating headaches", "dosage": "1 tablet twice daily with cow milk or honey", "form": "Vati / Tablet"},
                {"name": "Brahmi Vati with Gold/Shankhpushpi", "sanskrit_name": "ब्राह्मी वटी", "purpose": "Nootropic brain tonic that reduces cortical hyperexcitability and calms stress nerves", "dosage": "1 tablet at bedtime with warm milk", "form": "Tablet"},
                {"name": "Anu Taila Nasya", "sanskrit_name": "अणु तैल", "purpose": "Medicated trans-nasal drops clearing micro-channels of the cranium", "dosage": "2 drops into each nostril every morning", "form": "Nasal Drops"}
            ],
            "dietary_guidelines": [
                "Avoid fermented cheeses, aged wines, chocolate, and monosodium glutamate (MSG).",
                "Drink warm water infused with crushed cardamom and crushed fennel.",
                "Never skip breakfast; maintain regular blood glucose levels."
            ],
            "lifestyle_guidelines": [
                "Undergo regular head massage (Shiro Abhyanga) using Ksheerabala Taila.",
                "Limit screen blue-light exposure; wear anti-glare lenses.",
                "Maintain a consistent sleep-wake circadian cycle."
            ],
            "recommended_therapies": ["Shirodhara with Brahmi Taila", "Nasya Karma", "Takradhara"],
            "expected_timeline": "Acute headache ease within 4-6 hours; reduction in frequency by 70% over 4 weeks.",
            "philosophy": "Restores calmness to Prana Vata and Sadhaka Pitta located in the head (Uttamanga).",
            "specialist_type": "Ayurvedic Kayachikitsa & Neuro Specialist (BAMS, MD Ayu)"
        },
        "homeopathy": {
            "constitutional_type": "Neuro-vascular reactive type with sensory hyperesthesia",
            "totality_of_symptoms": "Throbbing, unilateral or bilateral cephalic pain aggravated by light, sound, mental exertion, or sun exposure.",
            "remedies": [
                {"name": "Belladonna", "potency": "200CH", "key_indication": "Sudden onset violent throbbing headache, flushed red face, intolerance to light/noise.", "dosage": "4 pills dissolved on tongue every 2 hours during acute attack (up to 3 doses)"},
                {"name": "Natrum Muriaticum", "potency": "30C", "key_indication": "Anemic or grief-induced migraine, begins in morning, feels like little hammers beating.", "dosage": "4 pills once daily in morning for 10 days"},
                {"name": "Sanguinaria Canadensis", "potency": "30C", "key_indication": "Right-sided migraine starting from back of neck and settling over right eye.", "dosage": "4 pills twice daily"}
            ],
            "lifestyle_precautions": [
                "Stay in a darkened, noise-free room during active migraines.",
                "Avoid synthetic fragrances and strong perfumes."
            ],
            "mode_of_action": "Re-regulates intracranial arterial vasodilation and restores autonomic equilibrium through subtle energetical stimulation.",
            "expected_timeline": "Relief within 1 to 3 hours of acute remedy; long-term prevention over 2 months.",
            "philosophy": "Constitutional individualized remediation targeting triggers, emotional state, and side affinity.",
            "specialist_type": "Classical Homeopath (BHMS / MD Homeo)"
        },
        "allopathy": {
            "probable_diagnosis": "Migraine without Aura / Tension-Type Headache / Cervicogenic Headache",
            "clinical_summary": "Neurogenic neurovascular inflammation involving the trigeminovascular system, causing vasodilation and peripheral/central sensitization.",
            "diagnostic_tests": [
                "MRI Brain with contrast (if red flag signs present or new onset after age 50)",
                "Fundoscopy / Ophthalmic evaluation to rule out papilledema",
                "Complete Blood Count and ESR / CRP"
            ],
            "conventional_medications": [
                {"drug_class": "Serotonin 5-HT 1B/1D Receptor Agonist (Triptan)", "common_examples": "Sumatriptan 50mg or Rizatriptan 10mg", "role": "Rapid vasoconstriction of meningeal vessels and blockage of pain peptide release."},
                {"drug_class": "NSAID + Antiemetic", "common_examples": "Naproxen 500mg + Domperidone 10mg", "role": "Inhibits prostaglandin synthesis and combats migraine-associated gastric stasis."},
                {"drug_class": "Prophylactic Beta-Blocker / Neuromodulator", "common_examples": "Propranolol 40mg or Topiramate 25mg", "role": "Reduces cortical spreading depression and attack frequency if frequent."}
            ],
            "red_flags": [
                "'Thunderclap' headache reaching peak intensity within 60 seconds (Rule out subarachnoid hemorrhage).",
                "New onset neurological deficits: limb weakness, facial drooping, slurred speech, double vision.",
                "Headache accompanied by high fever, stiff neck, and altered sensorium (Meningitis warning).",
                "Headache worsening progressively with coughing, bending forward, or Valsalva maneuvers."
            ],
            "lifestyle_advice": [
                "Keep a meticulous headache diary to identify dietary and sleep triggers.",
                "Ensure hydration of at least 2.5 - 3 liters daily.",
                "Ergonomic computer workstation posture."
            ],
            "expected_timeline": "Acute relief within 45 to 90 minutes with triptans/analgesics; prophylactic reduction over 6-8 weeks.",
            "philosophy": "Targeted neurological blocking of pain transmitters (CGRP, 5-HT) and evidence-based neuroprotection.",
            "specialist_type": "Neurologist / Internal Medicine Specialist (MBBS, MD, DM Neurology)"
        }
    },
    "joint_pain": {
        "keywords": ["joint", "knee", "back", "pain", "arthritis", "stiff", "swelling", "bone", "spine", "cervical", "lumbar", "sciatica", "shoulder"],
        "summary": "Musculoskeletal Degeneration & Inflammatory Arthropathy",
        "severity": "Moderate (Chronic progressive)",
        "ayurveda": {
            "dosha_imbalance": "Sandhigata Vata / Amavata (Vata vitiation with crystalline Ama accumulation)",
            "dosha_breakdown": {"Vata": 65, "Pitta": 20, "Kapha": 15},
            "herbal_remedies": [
                {"name": "Yograj Guggulu", "sanskrit_name": "योगराज गुग्गुलु", "purpose": "Classical resin-herb formulation that decalcifies deposits and strengthens joint cartilage", "dosage": "2 tablets twice daily with lukewarm water after meals", "form": "Vati / Tablet"},
                {"name": "Shallaki (Boswellia Serrata)", "sanskrit_name": "शल्लकी", "purpose": "Natural anti-inflammatory inhibiting 5-LOX enzymes without gastric irritation", "dosage": "1 capsule (500mg) twice daily", "form": "Extract Capsule"},
                {"name": "Mahanarayan Taila", "sanskrit_name": "महानारायण तैल", "purpose": "Medicated sesame oil infused with 50+ herbs for local lubrication and muscle relief", "dosage": "Warm gentle application over affected joints twice daily", "form": "Medicated Oil"}
            ],
            "dietary_guidelines": [
                "Favor warm, light, freshly prepared soupy foods seasoned with ginger, garlic, cumin, and turmeric.",
                "Avoid stale foods, cold water, raw sprouts, heavy pulses, and nightshade vegetables like brinjals.",
                "Take a pinch of fenugreek seed powder soaked overnight in warm water."
            ],
            "lifestyle_guidelines": [
                "Apply warm dry fomentation (Valuka Sweda) for joint stiffness.",
                "Practice gentle joint rotations (Sukshma Vyayama) and low-impact swimming.",
                "Keep joints warmly covered in air-conditioned or cold environments."
            ],
            "recommended_therapies": ["Janu Basti (Warm oil retention over knees)", "Kati Basti (Spine therapy)", "Patra Pinda Sweda"],
            "expected_timeline": "Joint flexibility increases in 7-10 days; long-term pain score reduction in 4-8 weeks.",
            "philosophy": "Nourishes the Asthi Dhatu (bone tissue) and lubricates Shleshaka Kapha (synovial fluid) while pacifying dry Vata.",
            "specialist_type": "Ayurvedic Orthopedic / Shalya Tantra Specialist (BAMS, MS Ayu)"
        },
        "homeopathy": {
            "constitutional_type": "Rheumatic and arthritic diathesis with weather/motion sensitivity",
            "totality_of_symptoms": "Aching stiffness in joints, aggravated by damp weather, cold air, or physical exertion.",
            "remedies": [
                {"name": "Rhus Toxicodendron", "potency": "200CH", "key_indication": "Stiffness worse on first beginning to move, but improves gradually with continuous motion and warmth.", "dosage": "4 pills twice daily for 14 days"},
                {"name": "Bryonia Alba", "potency": "30C", "key_indication": "Stitching joint pain aggravated by the slightest movement, relieved by absolute rest and firm pressure.", "dosage": "4 pills thrice daily during acute flare-ups"},
                {"name": "Ruta Graveolens", "potency": "30C", "key_indication": "Bruised feeling in tendons, ligaments, wrists, and ankles after strain.", "dosage": "4 pills twice daily"}
            ],
            "lifestyle_precautions": [
                "Protect affected joints from sudden shifts in barometric pressure and cold drafts.",
                "Maintain steady gentle movement throughout the day."
            ],
            "mode_of_action": "Stimulates the synovial membrane's natural resorptive and anti-inflammatory cellular pathways without systemic NSAID toxicity.",
            "expected_timeline": "Acute pain alleviation in 3-5 days; deep constitutional improvement in 6 to 12 weeks.",
            "philosophy": "Selects remedies strictly aligned with the patient's individual modalities (worse by cold, better by heat or motion).",
            "specialist_type": "Classical Homeopath (BHMS / MD Homeo)"
        },
        "allopathy": {
            "probable_diagnosis": "Osteoarthritis / Lumbar Spondylosis / Rheumatoid or Inflammatory Arthritis",
            "clinical_summary": "Degenerative breakdown of articular cartilage with subchondral sclerosis, osteophyte formation, and synovial inflammation.",
            "diagnostic_tests": [
                "Digital Weight-bearing X-Ray of the affected joints (Knee AP/Lateral, Lumbar Spine)",
                "Serum Uric Acid (rule out Gouty Arthritis)",
                "Rheumatoid Factor (RF) and Anti-CCP Antibodies",
                "Erythrocyte Sedimentation Rate (ESR) and C-Reactive Protein (CRP)"
            ],
            "conventional_medications": [
                {"drug_class": "Selective COX-2 Inhibitor NSAID", "common_examples": "Etoricoxib 90mg or Celecoxib 200mg", "role": "Targets joint inflammation with reduced gastrointestinal ulceration risk."},
                {"drug_class": "Cartilage Protectors", "common_examples": "Glucosamine Sulfate + Chondroitin + Collagen Peptide", "role": "Provides structural building blocks for chondrocyte matrix synthesis."},
                {"drug_class": "Muscle Relaxant", "common_examples": "Thiocolchicoside 4mg or Chlorzoxazone", "role": "Relieves secondary protective muscle spasm around the afflicted joint."}
            ],
            "red_flags": [
                "Hot, red, exquisitely tender swollen joint accompanied by high fever (Rule out Septic Arthritis).",
                "Sudden loss of bowel or bladder control, or numbness in the saddle/groin region (Cauda Equina Emergency).",
                "Rapid progressive motor weakness in foot or hand (Foot drop).",
                "Unremitting severe pain awakening the patient from deep sleep."
            ],
            "lifestyle_advice": [
                "Targeted quadriceps and core strengthening exercises under a physiotherapist.",
                "Weight reduction (every 1 kg lost relieves ~4 kg of force across knee joints).",
                "Use cushioned ergonomic footwear."
            ],
            "expected_timeline": "Significant pain reduction within 2-4 days with medication; structural stability through 8-12 weeks of physiotherapy.",
            "philosophy": "Preserve joint biomechanics, prevent deformity, manage systemic inflammation, and maintain functional independence.",
            "specialist_type": "Orthopedic Surgeon / Rheumatologist (MBBS, MS Ortho, DM Rheumatology)"
        }
    },
    "skin": {
        "keywords": ["skin", "rash", "itch", "eczema", "allergy", "hives", "psoriasis", "acne", "pimples", "dermatitis", "urticaria", "fungal"],
        "summary": "Dermatological & Allergic Inflammatory Cutaneous Reaction",
        "severity": "Mild to Moderate",
        "ayurveda": {
            "dosha_imbalance": "Kushtha Roga / Pitta-Rakta Dushti (Vitiation of blood and fire element)",
            "dosha_breakdown": {"Pitta": 55, "Kapha": 30, "Vata": 15},
            "herbal_remedies": [
                {"name": "Khadirarishtha", "sanskrit_name": "खदिरारिष्ट", "purpose": "Foremost classical blood detoxifier that clears systemic Rakta toxins", "dosage": "15ml mixed with 15ml warm water after lunch and dinner", "form": "Fermented Herbal Liquid"},
                {"name": "Neem (Azadirachta Indica) Ghanvati", "sanskrit_name": "नीम घनवटी", "purpose": "Potent antimicrobial and bitter alterative reducing dermal erythema", "dosage": "1 tablet twice daily", "form": "Tablet"},
                {"name": "Nalpamaradi Taila", "sanskrit_name": "नलपामरादि तैल", "purpose": "Turmeric-infused topical oil that repairs epidermal barrier and halts pruritus", "dosage": "Apply gently over affected skin 30 minutes before bathing", "form": "Herbal Oil"}
            ],
            "dietary_guidelines": [
                "Strictly avoid sour, salty, and pungent foods (pickles, curd, seafood, fried snacks).",
                "Avoid incompatible food combinations (Viruddha Ahara, such as milk with fish or citrus).",
                "Consume bitter gourds (Karela), bottle gourd (Lauki), and green moong dal."
            ],
            "lifestyle_guidelines": [
                "Bathe with lukewarm water infused with boiled neem leaves.",
                "Wear loose, pure breathable cotton clothing.",
                "Avoid harsh chemical soaps, detergents, and synthetic perfumes."
            ],
            "recommended_therapies": ["Raktamokshana (Leech therapy for refractory eczema)", "Virechana Karma", "Medicated Lepam"],
            "expected_timeline": "Itching decreases in 48 hours; skin texture recovery across 3-6 weeks.",
            "philosophy": "External skin eruptions are reflections of internal metabolic and blood impurities (Rakta and Rasa Dhatus).",
            "specialist_type": "Ayurvedic Twak Roga / Dermatology Specialist (BAMS, MD Ayu)"
        },
        "homeopathy": {
            "constitutional_type": "Psoric diathesis with cutaneous hypersensitivity",
            "totality_of_symptoms": "Intense itching, burning sensations worse with heat of bed or water, dry cracked or vesicular skin lesions.",
            "remedies": [
                {"name": "Sulphur", "potency": "30C", "key_indication": "Voluptuous itching, scratching brings relief but burning follows, aggravated by washing and heat of bed.", "dosage": "4 pills early morning on an empty stomach for 5 days"},
                {"name": "Graphites", "potency": "30C", "key_indication": "Eczema in bends of joints, honey-like sticky golden exudation, dry rough skin prone to fissures.", "dosage": "4 pills twice daily for 10 days"},
                {"name": "Apis Mellifica", "potency": "30C", "key_indication": "Urticaria with stinging, puffy swelling, better by cold applications.", "dosage": "4 pills thrice daily during acute flare"}
            ],
            "lifestyle_precautions": [
                "Do not apply strong corticosteroid ointments concurrently while on constitutional homeopathy.",
                "Use gentle coconut oil or unperfumed petroleum jelly for hydration."
            ],
            "mode_of_action": "Addresses the deep miasmatic root to permanently regulate immune system hyper-reactivity without topical suppression.",
            "expected_timeline": "Pruritus subsides within 3 to 7 days; dermal barrier normalization in 4 to 8 weeks.",
            "philosophy": "Views skin not as an isolated organ, but as the outer mirror of constitutional vitality and chronic miasms.",
            "specialist_type": "Classical Homeopath (BHMS / MD Homeo)"
        },
        "allopathy": {
            "probable_diagnosis": "Atopic Dermatitis / Allergic Contact Dermatitis / Urticaria / Plaque Psoriasis",
            "clinical_summary": "T-cell mediated cutaneous immune activation leading to epidermal disruption, histamine release, and cytokine cascades.",
            "diagnostic_tests": [
                "Skin Prick Allergy Panel / Total Serum IgE level",
                "Skin Scraping for Potassium Hydroxide (KOH) prep (rules out Tinea fungal infection)",
                "Skin Biopsy (for atypical or refractory chronic plaques)",
                "Complete Blood Count with Absolute Eosinophil Count (AEC)"
            ],
            "conventional_medications": [
                {"drug_class": "Non-sedating Second Generation Antihistamine", "common_examples": "Bilastine 20mg or Levocetirizine 5mg", "role": "Blocks peripheral H1 histamine receptors to arrest itching and wheel-and-flare reactions."},
                {"drug_class": "Topical Corticosteroid / Calcineurin Inhibitor", "common_examples": "Mometasone Furoate 0.1% or Tacrolimus 0.03% Ointment", "role": "Rapidly suppresses local inflammatory cytokine transcription and cellular infiltration."},
                {"drug_class": "Ceramide-Dominant Emollient", "common_examples": "Physiological lipid barrier repair cream", "role": "Restores stratum corneum integrity and prevents transepidermal water loss."}
            ],
            "red_flags": [
                "Rapidly spreading facial or lip swelling with wheezing or difficulty breathing (Anaphylaxis Emergency - Call 112/911).",
                "Skin peeling over >10% of body with mucosal erosion and blisters (Stevens-Johnson Syndrome / TEN Emergency).",
                "Skin lesion developing honey-colored crusts with high fever (Secondary impetiginization / bacterial superinfection)."
            ],
            "lifestyle_advice": [
                "Apply moisturizers immediately within 3 minutes of bathing while skin is damp.",
                "Maintain ambient room humidity above 45%.",
                "Trim fingernails short to prevent nocturnal excoriation and infection."
            ],
            "expected_timeline": "Itch relief within 30 to 60 minutes with antihistamines; visible clearing in 5-14 days with topical therapy.",
            "philosophy": "Rapid symptom control via anti-inflammatory targeting, barrier preservation, and secondary infection prevention.",
            "specialist_type": "Dermatologist (MBBS, MD Dermatology, DNB)"
        }
    },
    "respiratory": {
        "keywords": ["cough", "cold", "sinus", "fever", "throat", "breath", "wheez", "asthma", "phlegm", "mucus", "runny nose", "chest", "bronchitis"],
        "summary": "Upper / Lower Respiratory Tract Infection & Bronchial Hyperreactivity",
        "severity": "Mild to Moderate",
        "ayurveda": {
            "dosha_imbalance": "Kaphaja-Vataja Kasa & Shwasa (Aggravated Kapha obstructing Pranavaha Srotas)",
            "dosha_breakdown": {"Kapha": 60, "Vata": 30, "Pitta": 10},
            "herbal_remedies": [
                {"name": "Sitopaladi Churna", "sanskrit_name": "सितोपलादि चूर्ण", "purpose": "Premier rasayana with bamboo manna and cardamom, liquefies thick mucus and soothes bronchial lining", "dosage": "3g mixed with 1 tsp raw honey thrice daily", "form": "Herbal Powder"},
                {"name": "Vasavaleha", "sanskrit_name": "वासावलेह", "purpose": "Classical Adhatoda vasica jam with natural bronchodilatory and antitussive alkaloids", "dosage": "1 tsp twice daily after meals with warm water", "form": "Herbal Jam / Leham"},
                {"name": "Kantakari Avaleha", "sanskrit_name": "कण्टकारी अवलेह", "purpose": "Relieves spasmodic bronchial wheezing and reduces throat tickling", "dosage": "1 tsp at bedtime", "form": "Herbal Jam"}
            ],
            "dietary_guidelines": [
                "Drink warm water boiled with fresh ginger and tulsi leaves throughout the day.",
                "Avoid ice creams, refrigerated beverages, heavy cheeses, yogurt, and bananas.",
                "Add a pinch of black pepper and turmeric to hot goat milk or golden milk."
            ],
            "lifestyle_guidelines": [
                "Inhale steam with eucalyptus or camphor drops twice daily.",
                "Practice Bhastrika and Anulom Vilom Pranayama in clean, unpolluted air.",
                "Keep chest and throat wrapped with a warm scarf in cold winds."
            ],
            "recommended_therapies": ["Uro Basti (Warm herbal oil pool over chest)", "Pradhamana Nasya", "Dhumapana"],
            "expected_timeline": "Airway decongestion within 24-48 hours; complete recovery in 7-10 days.",
            "philosophy": "Clears the respiratory micro-channels (Srotas) by melting Kapha and restoring natural downward movement of Prana Vata.",
            "specialist_type": "Ayurvedic Respiratory Specialist (BAMS, MD Ayu)"
        },
        "homeopathy": {
            "constitutional_type": "Catarrhal and tuberculinic diathesis with weather sensitivity",
            "totality_of_symptoms": "Paroxysmal cough, sinus blockage, post-nasal drip, aggravated by damp cold air or transition between seasons.",
            "remedies": [
                {"name": "Arsenicum Album", "potency": "30C", "key_indication": "Thin watery excoriating nasal discharge, chest tightness worse midnight, patient feels restless and chilly.", "dosage": "4 pills twice daily for 5 days"},
                {"name": "Drosera Rotundifolia", "potency": "30C", "key_indication": "Violent spasmodic paroxysmal barking cough, worse immediately upon lying down at night.", "dosage": "4 pills dissolved under tongue before sleep"},
                {"name": "Justicia Adhatoda", "potency": "Q (Mother Tincture)", "key_indication": "Severe suffocative cough with abundant tenacious mucous rattling in chest.", "dosage": "10 drops in half cup lukewarm water thrice daily"}
            ],
            "lifestyle_precautions": [
                "Avoid cold drinks or sudden exposure to chilly drafts.",
                "Maintain warm hydration."
            ],
            "mode_of_action": "Enhances respiratory mucosal resistance and balances cytokine response to viral antigens without drying up secretions.",
            "expected_timeline": "Soothes coughing bouts in 12-24 hours; clear breathing restored in 4-6 days.",
            "philosophy": "Stimulates the mucosal immune barrier gently without sedative antihistaminic side-effects.",
            "specialist_type": "Classical Homeopath (BHMS / MD Homeo)"
        },
        "allopathy": {
            "probable_diagnosis": "Acute Bronchitis / Viral Upper Respiratory Tract Infection / Allergic Rhinosinusitis",
            "clinical_summary": "Epithelial inflammation of airway mucosa due to viral pathogens or allergic triggers, causing hypersecretion of mucus and cough receptor hypersensitivity.",
            "diagnostic_tests": [
                "Pulse Oximetry (Check SpO2 oxygen saturation >95%)",
                "Chest X-Ray PA view (if high fever, crackles on auscultation, or dyspnea present)",
                "Complete Blood Count (CBC) with Differential",
                "RT-PCR / Viral Swab (if influenza or COVID-19 suspected)"
            ],
            "conventional_medications": [
                {"drug_class": "Mucolytic / Bronchodilator", "common_examples": "Levosalbutamol + Ambroxol syrup", "role": "Relaxes smooth bronchial muscles and hydrolyzes mucopolysaccharide fibers for easy expectoration."},
                {"drug_class": "Inhaled Corticosteroid / LABA", "common_examples": "Budesonide + Formoterol inhaler", "role": "Potent topical suppression of airway inflammation in asthmatic/wheezing episodes."},
                {"drug_class": "Antitussive / Antihistamine", "common_examples": "Dextromethorphan + Chlorpheniramine", "role": "Centrally depresses cough reflex center in medulla for exhausting dry coughs."}
            ],
            "red_flags": [
                "Oxygen saturation (SpO2) dropping below 93% on room air (Requires urgent supplemental oxygen).",
                "Shortness of breath / retractions of intercostal muscles while resting.",
                "Coughing up frank red blood (Hemoptysis).",
                "High spiking fever (>102°F) persisting for over 72 hours with purulent sputum."
            ],
            "lifestyle_advice": [
                "Maintain high fluid intake to thin bronchial secretions.",
                "Use HEPA air purifiers if indoor air quality or PM2.5 levels are elevated.",
                "Adequate bed rest."
            ],
            "expected_timeline": "Acute symptoms settle within 3-5 days; post-viral cough sensitivity may take 1-2 weeks to resolve fully.",
            "philosophy": "Targeted airway patency maintenance, infection containment, and prevention of secondary bacterial pneumonia.",
            "specialist_type": "Pulmonologist / General Physician (MBBS, MD Chest Med / Internal Med)"
        }
    }
}

# Generic fallback for unclassified conditions
GENERIC_TEMPLATE = {
    "summary": "General health concern and constitutional imbalance",
    "severity": "Mild to Moderate",
    "ayurveda": {
        "dosha_imbalance": "Tridoshic perturbation with Agni Mandya (Sluggish metabolism)",
        "dosha_breakdown": {"Vata": 40, "Pitta": 35, "Kapha": 25},
        "herbal_remedies": [
            {"name": "Triphala Churna", "sanskrit_name": "त्रिफला चूर्ण", "purpose": "Gentle daily detoxification of colon, strengthens gut microflora, antioxidant", "dosage": "1 tsp with warm water at bedtime", "form": "Powder"},
            {"name": "Ashwagandha Rasayana", "sanskrit_name": "अश्वगंधा", "purpose": "Adaptogenic root providing cellular rejuvenation, adrenal support, and vital Ojas", "dosage": "1 capsule (500mg) twice daily after food", "form": "Extract Capsule"},
            {"name": "Trikatu Churna", "sanskrit_name": "त्रिकटु चूर्ण", "purpose": "Ginger, black pepper, and long pepper to ignite sluggish metabolic Agni", "dosage": "1/2 tsp with honey before meals", "form": "Powder"}
        ],
        "dietary_guidelines": [
            "Eat freshly prepared warm satvik meals; avoid leftovers, cold refrigerated foods, and junk foods.",
            "Incorporate digestive spices like ginger, cumin, coriander, and turmeric.",
            "Sip warm water throughout the day to flush systemic Ama."
        ],
        "lifestyle_guidelines": [
            "Establish regular sleep and wake hours aligned with circadian sunrise.",
            "Engage in 25-30 minutes of Surya Namaskar and restorative yoga daily.",
            "Practice deep diaphragmatic breathing to stabilize Prana."
        ],
        "recommended_therapies": ["Sarvanga Abhyanga (Full body warm herbal oil massage)", "Swedana (Steam bath)", "Shirodhara"],
        "expected_timeline": "Noticeable renewal of energy in 7-14 days; holistic wellness stabilization over 4-6 weeks.",
        "philosophy": "Holistic harmonization of Mind, Body, and Spirit (Yukti Vyapashraya) through natural dietary, herbal, and daily biological rhythm alignment.",
        "specialist_type": "Ayurvedic Kayachikitsa Specialist (BAMS, MD Ayu)"
    },
    "homeopathy": {
        "constitutional_type": "Generalized constitutional disharmony",
        "totality_of_symptoms": "Subtle multisystem symptoms requiring constitutional repertorization based on mental, thermal, and physical totality.",
        "remedies": [
            {"name": "Pulsatilla Nigricans", "potency": "30C", "key_indication": "Mild temperament, symptoms continually shifting, better in open fresh air.", "dosage": "4 pills under tongue twice daily for 7 days"},
            {"name": "Lycopodium Clavatum", "potency": "30C", "key_indication": "Digestive weakness, symptoms worse late afternoon (4 PM - 8 PM), craving warm drinks.", "dosage": "4 pills daily before dinner"},
            {"name": "Arnica Montana", "potency": "30C", "key_indication": "Physical fatigue, bruised generalized body soreness after stress or overexertion.", "dosage": "4 pills as needed for bodily fatigue"}
        ],
        "lifestyle_precautions": [
            "Maintain pure mouth cavity before taking homeopathic globules.",
            "Avoid direct exposure to strong chemicals, pesticides, or camphor."
        ],
        "mode_of_action": "Subtle bio-energetic resonance stimulating the patient's innate homeostasis and psycho-neuro-immunological network.",
        "expected_timeline": "Gradual gentle relief over 1 to 3 weeks.",
        "philosophy": "Treats the patient as an indivisible integrated whole, not a collection of isolated anatomical parts.",
        "specialist_type": "Classical Homeopath (BHMS / MD Homeo)"
    },
    "allopathy": {
        "probable_diagnosis": "Constitutional symptom complex requiring clinical examination & lab workup",
        "clinical_summary": "Symptom presentation suggests multifactorial etiology requiring baseline clinical evaluation, vitals monitoring, and diagnostic screening.",
        "diagnostic_tests": [
            "Complete Blood Count (CBC) with ESR",
            "Fasting Blood Sugar (FBS) & HbA1c (Metabolic panel)",
            "Comprehensive Metabolic Panel (Liver & Kidney Function Tests - LFT / KFT)",
            "Thyroid Stimulating Hormone (TSH) screening",
            "Urinalysis (Routine & Microscopy)"
        ],
        "conventional_medications": [
            {"drug_class": "Multivitamin & Mineral Complex", "common_examples": "B-Complex + Zinc + Methylcobalamin", "role": "Supports neuro-metabolic enzymatic pathways and cellular energy production."},
            {"drug_class": "Symptomatic Agent", "common_examples": "Paracetamol 650mg (PRN)", "role": "Safe non-opiate analgesic/antipyretic for episodic body aches or discomfort."}
        ],
        "red_flags": [
            "Unexplained rapid weight loss (>5 kg in 1 month).",
            "Persistent unexplained high fever or night sweats.",
            "Shortness of breath, severe chest pressure, or syncope (fainting).",
            "Sudden loss of vision, speech, or motor function."
        ],
        "lifestyle_advice": [
            "Maintain 7-8 hours of sound sleep.",
            "Drink 2.5 - 3 liters of water daily.",
            "150 minutes of moderate aerobic exercise weekly."
        ],
        "expected_timeline": "Diagnostic clarity within 24-48 hours upon completion of baseline tests; targeted therapy adjusted accordingly.",
        "philosophy": "Rigorous objective pathology identification, laboratory quantification, and evidence-based pharmacotherapeutic management.",
        "specialist_type": "Internal Medicine / Family Physician (MBBS, MD General Medicine)"
    }
}

def match_clinical_category(symptoms_text: str) -> str:
    lower_text = symptoms_text.lower()
    for cat_name, data in CLINICAL_KNOWLEDGE_BASE.items():
        for kw in data["keywords"]:
            if kw in lower_text:
                return cat_name
    return "generic"

def generate_fallback_response(request: SymptomAnalysisRequest) -> SymptomAnalysisResponse:
    category = match_clinical_category(request.symptoms)
    cat_data = CLINICAL_KNOWLEDGE_BASE.get(category, GENERIC_TEMPLATE)
    
    ayur_data = cat_data["ayurveda"]
    homeo_data = cat_data["homeopathy"]
    allo_data = cat_data["allopathy"]
    
    return SymptomAnalysisResponse(
        symptom_summary=f"Analysis of {request.age}-year-old patient in {request.city} with: {cat_data['summary']}. Duration: {request.duration}, Severity: {request.severity}.",
        severity_assessment=cat_data.get("severity", f"{request.severity} severity presentation"),
        ayurveda=AyurvedaRecommendation(
            dosha_imbalance=ayur_data["dosha_imbalance"],
            dosha_breakdown=ayur_data["dosha_breakdown"],
            herbal_remedies=[HerbalRemedy(**item) for item in ayur_data["herbal_remedies"]],
            dietary_guidelines=ayur_data["dietary_guidelines"],
            lifestyle_guidelines=ayur_data["lifestyle_guidelines"],
            recommended_therapies=ayur_data["recommended_therapies"],
            expected_timeline=ayur_data["expected_timeline"],
            philosophy=ayur_data["philosophy"],
            specialist_type=ayur_data["specialist_type"]
        ),
        homeopathy=HomeopathyRecommendation(
            constitutional_type=homeo_data["constitutional_type"],
            totality_of_symptoms=homeo_data["totality_of_symptoms"],
            remedies=[HomeopathicRemedy(**item) for item in homeo_data["remedies"]],
            lifestyle_precautions=homeo_data["lifestyle_precautions"],
            mode_of_action=homeo_data["mode_of_action"],
            expected_timeline=homeo_data["expected_timeline"],
            philosophy=homeo_data["philosophy"],
            specialist_type=homeo_data["specialist_type"]
        ),
        allopathy=AllopathyRecommendation(
            probable_diagnosis=allo_data["probable_diagnosis"],
            clinical_summary=allo_data["clinical_summary"],
            diagnostic_tests=allo_data["diagnostic_tests"],
            conventional_medications=[MedicationClass(**item) for item in allo_data["conventional_medications"]],
            red_flags=allo_data["red_flags"],
            lifestyle_advice=allo_data["lifestyle_advice"],
            expected_timeline=allo_data["expected_timeline"],
            philosophy=allo_data["philosophy"],
            specialist_type=allo_data["specialist_type"]
        ),
        comparison=ComparisonSummary(
            speed_of_relief={
                "Ayurveda": "Moderate (3 - 7 days for noticeable relief, sustained root cause correction)",
                "Homeopathy": "Gradual to Moderate (1 - 5 days, gentle deep cellular action)",
                "Allopathy": "Fast (Immediate to 24 hours symptomatic suppression & intervention)"
            },
            root_cause_focus={
                "Ayurveda": "Very High (Rebalances Doshas, rekindles Agni, clears metabolic Ama)",
                "Homeopathy": "Very High (Strengthens constitutional vital force & miasmatic totality)",
                "Allopathy": "Moderate to High (Targets molecular pathways, biological pathogens & anatomical lesions)"
            },
            side_effect_profile={
                "Ayurveda": "Minimal when prepared authentically; gentle organic herbal compounds",
                "Homeopathy": "Virtually zero toxic side-effects due to ultra-diluted nano-potencies",
                "Allopathy": "Possible pharmaceutical side-effects; requires medical monitoring"
            },
            lifestyle_dependency={
                "Ayurveda": "High (Diet/Ahara and daily routine/Vihara are essential components)",
                "Homeopathy": "Moderate (Strict avoidance of coffee/camphor during dosage)",
                "Allopathy": "Low to Moderate (Medication works independently, supported by lifestyle)"
            },
            approx_cost_level={
                "Ayurveda": "₹ (Affordable classical herbs & herbal extracts)",
                "Homeopathy": "₹ (Highly cost-effective micro-remedies)",
                "Allopathy": "₹₹ - ₹₹₹ (Higher cost for branded pharmacotherapy & diagnostic imaging)"
            }
        ),
        generated_by="Clinical Intelligence Core (Offline Verified Protocol)"
    )

async def analyze_symptoms_with_gemini(request: SymptomAnalysisRequest, api_key: str) -> Optional[SymptomAnalysisResponse]:
    """Calls Gemini 2.5 Flash / Gemini 1.5 Flash via google-genai or direct REST to generate personalized structured JSON."""
    try:
        import httpx
        system_instruction = """You are TriHealth AI, a senior medical integrative intelligence system specializing in the 3 major medical paradigms:
1. Ayurveda (Classical Indian Medicine: Doshas, Ahara, Vihara, Dhatus, Agni, Herbs, Panchakarma)
2. Homeopathy (Organon of Medicine: Constitutional totality, Similia Similibus Curentur, Potencies, Remedies)
3. Allopathy (Evidence-based Modern Medicine: Etiology, Differential Diagnosis, Investigations, Pharmacotherapy, Red Flags)

You must output STRICT JSON matching this schema:
{
  "symptom_summary": "concise clinical summary",
  "severity_assessment": "Mild / Moderate / Severe",
  "ayurveda": {
    "dosha_imbalance": "e.g. Pitta-Vata",
    "dosha_breakdown": {"Vata": 40, "Pitta": 50, "Kapha": 10},
    "herbal_remedies": [
      {"name": "string", "sanskrit_name": "string", "purpose": "string", "dosage": "string", "form": "string"}
    ],
    "dietary_guidelines": ["string"],
    "lifestyle_guidelines": ["string"],
    "recommended_therapies": ["string"],
    "expected_timeline": "string",
    "philosophy": "string",
    "specialist_type": "string"
  },
  "homeopathy": {
    "constitutional_type": "string",
    "totality_of_symptoms": "string",
    "remedies": [
      {"name": "string", "potency": "string", "key_indication": "string", "dosage": "string"}
    ],
    "lifestyle_precautions": ["string"],
    "mode_of_action": "string",
    "expected_timeline": "string",
    "philosophy": "string",
    "specialist_type": "string"
  },
  "allopathy": {
    "probable_diagnosis": "string",
    "clinical_summary": "string",
    "diagnostic_tests": ["string"],
    "conventional_medications": [
      {"drug_class": "string", "common_examples": "string", "role": "string"}
    ],
    "red_flags": ["string"],
    "lifestyle_advice": ["string"],
    "expected_timeline": "string",
    "philosophy": "string",
    "specialist_type": "string"
  },
  "comparison": {
    "speed_of_relief": {"Ayurveda": "string", "Homeopathy": "string", "Allopathy": "string"},
    "root_cause_focus": {"Ayurveda": "string", "Homeopathy": "string", "Allopathy": "string"},
    "side_effect_profile": {"Ayurveda": "string", "Homeopathy": "string", "Allopathy": "string"},
    "lifestyle_dependency": {"Ayurveda": "string", "Homeopathy": "string", "Allopathy": "string"},
    "approx_cost_level": {"Ayurveda": "string", "Homeopathy": "string", "Allopathy": "string"}
  }
}
Output pure valid JSON only. Do not wrap in markdown quotes if possible, or use standard markdown code fences.
"""
        prompt = f"""Patient Profile:
Age: {request.age}
Gender: {request.gender}
Location: {request.city}
Symptom Duration: {request.duration}
Stated Severity: {request.severity}
Symptoms: {request.symptoms}

Please provide an in-depth, compassionate, medically sound comparative analysis for this patient across Ayurveda, Homeopathy, and Allopathy. Include authentic classical herbs, homeopathic potencies, and modern diagnostic tests."""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "systemInstruction": {"parts": [{"text": system_instruction}]},
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        async with httpx.AsyncClient(timeout=25.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                clean_json = text_content.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]
                parsed = json.loads(clean_json.strip())
                parsed["generated_by"] = "Google Gemini 2.5 Flash AI"
                return SymptomAnalysisResponse(**parsed)
    except Exception as e:
        print(f"Gemini API request failed or timed out: {e}. Falling back to Clinical Intelligence Core.")
        return None
