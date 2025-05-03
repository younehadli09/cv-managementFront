'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react'; // Import Lucide icon for photo upload
import Sidebar from '@/components/sidebar';

type FormData = {
  
  // ENTETE
  nom: string;
  prenom: string;
  dateNaissance: string;
  adresse: string;
  email: string;
  nationalite: string;
  situationMaritale: string;
  permis: string;
  photo: string;

  // OBJECTIF
  objectif: string;

  // SITUATION ACTUELLE
  situationActuelle: string;

  // FORMATIONS
  formations: {
    type: string;
    etablissement: string;
    de: string;
    a: string;
    text: string;
  }[];

  // STAGES
  stages: {
    intituleStage: string;
    dateStage: string;
    anneeStage: string;
    descriptionStage: string;
  }[];

  // EXPERIENCES PROFESSIONNELLES
  experiencesProfessionnelles: {
    poste: string;
    etablissementExp: string;
    deExp: string;
    aExp: string;
    descriptionExp: string;
    achievement: string[];
  }[];

  // COMPETENCES
  competences: {
    titre: string;
    description: string;
  }[];

  // LANGUES
  langues: {
    intitule: string;
    niveau: string;
  }[];

  // LOISIRS
  loisirs: string[];

  // REFERENCES
  emailReference: string;
  telephoneReference: string;
  webReference: string;
  nomReference: string;
  relationReference: string;
};

export default function SubmitCV() {
  const [mode, setMode] = useState<'form' | 'pdf' | null>(null);
  const [response, setResponse] = useState('');
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    adresse: '',
    email: '',
    nationalite: '',
    situationMaritale: '',
    permis: '',
    photo: '',
    objectif: '',
    situationActuelle: '',
    formations: [
      {
        type: '',
        etablissement: '',
        de: '',
        a: '',
        text: '',
      },
    ],
    stages: [
      {
        intituleStage: '',
        dateStage: '',
        anneeStage: '',
        descriptionStage: '',
      },
    ],
    experiencesProfessionnelles: [
      {
        poste: '',
        etablissementExp: '',
        deExp: '',
        aExp: '',
        descriptionExp: '',
        achievement: [''],
      },
    ],
    competences: [
      {
        titre: '',
        description: '',
      },
    ],
    langues: [
      {
        intitule: '',
        niveau: '',
      },
    ],
    loisirs: [''],
    emailReference: '',
    telephoneReference: '',
    webReference: '',
    nomReference: '',
    relationReference: '',
  });
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    index?: number
  ) => {
    const { name, value } = e.target;
  
    if (section && index !== undefined) {
      const updatedSection = [...(formData[section as keyof FormData] as any[])];
      updatedSection[index] = { ...updatedSection[index], [name]: value };
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof Pick<FormData, 'formations' | 'stages' | 'experiencesProfessionnelles' | 'competences' | 'langues' | 'loisirs'>,
    index: number
  ) => {
    const { name, value } = e.target;
    
    if (section === 'loisirs') {
      const updatedLoisirs = [...formData.loisirs];
      updatedLoisirs[index] = value;
      setFormData({ ...formData, loisirs: updatedLoisirs });
    } else {
      const updatedSection = [...(formData[section] as any[])];
      updatedSection[index] = { ...updatedSection[index], [name]: value };
      setFormData({ ...formData, [section]: updatedSection });
    }
  };
  
  const getNewItem = (section: string) => {
    switch (section) {
      case 'formations':
        return { type: '', etablissement: '', de: '', a: '', text: '' };
      case 'stages':
        return { intituleStage: '', dateStage: '', anneeStage: '', descriptionStage: '' };
      case 'experiencesProfessionnelles':
        return { poste: '', etablissementExp: '', deExp: '', aExp: '', descriptionExp: '', achievement: [''] };
      case 'competences':
        return { titre: '', description: '' };
      case 'langues':
        return { intitule: '', niveau: '' };
      case 'loisirs':
        return '';
      default:
        return {};
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, photo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addItemToArray = (section: keyof FormData) => {
    const newItem = getNewItem(section);
    setFormData({ ...formData, [section]: [...(formData[section] as any[]), newItem] });
  };
  
  const removeItemFromArray = (section: keyof FormData, index: number) => {
    const updatedSection = (formData[section] as any[]).filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updatedSection });
  };
  
  const addAchievementToExperience = (index: number) => {
    const updatedExperiences = [...formData.experiencesProfessionnelles];
    updatedExperiences[index].achievement.push('');
    setFormData({ ...formData, experiencesProfessionnelles: updatedExperiences });
  };

  const removeAchievementFromExperience = (experienceIndex: number, achievementIndex: number) => {
    const updatedExperiences = [...formData.experiencesProfessionnelles];
    updatedExperiences[experienceIndex].achievement = updatedExperiences[experienceIndex].achievement.filter((_, i) => i !== achievementIndex);
    setFormData({ ...formData, experiencesProfessionnelles: updatedExperiences });
  };
 
  const handleFormSubmit = async () => {
    try {
      const jsonData = {
        entete: {
          nom: formData.nom,
          prenom: formData.prenom,
          dateNaissance: formData.dateNaissance,
          adresse: formData.adresse,
          nationalite: formData.nationalite,
          situationMaritale: formData.situationMaritale,
          permis: formData.permis,
          photo: formData.photo,
        },
        objectif: formData.objectif,
        situationActuelle: formData.situationActuelle,
        parcours: {
          formations: {
            diplome: formData.formations.map(formation => ({
              _type: formation.type,
              _etablissement: formation.etablissement,
              _de: formation.de,
              _a: formation.a,
              __text: formation.text,
            })),
          },
          stages: {
            stage: formData.stages.map(stage => ({
              intituleStage: stage.intituleStage,
              date: stage.dateStage,
              annee: stage.anneeStage,
              descriptionstage: stage.descriptionStage,
            })),
          },
          experiencesProfessionnelles: {
            experience: formData.experiencesProfessionnelles.map(exp => ({
              _poste: exp.poste,
              _etablissement: exp.etablissementExp,
              _de: exp.deExp,
              _a: exp.aExp,
              _id: `exp_${Math.random().toString(36).substring(2, 9)}`,
              description: exp.descriptionExp,
              achievement: exp.achievement.filter(a => a.trim() !== ''),
            })),
          },
        },
        competences: {
          competence: formData.competences.map(comp => ({
            titre: comp.titre,
            description: comp.description,
          })),
        },
        langues: {
          langue: formData.langues.map(langue => ({
            intitule: langue.intitule,
            niveau: langue.niveau,
          })),
        },
        loisirs: {
          loisir: formData.loisirs.filter(l => l.trim() !== ''),
        },
        references: {
          reference: {
            contact: {
              _email: formData.emailReference,
              _telephone: formData.telephoneReference,
              _web: formData.webReference || "http://example.com",
              nom: formData.nomReference,
              relation: formData.relationReference,
            }
          }
        },
      };

      const res = await fetch('http://localhost:5000/add_cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse('CV ajouté avec succès !');
        console.log('Success:', data);
      } else {
        setResponse(`Erreur: ${data.error || data.details || 'Unknown error'}`);
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setResponse('Une erreur est survenue lors de la soumission');
    }
  };

  const handlePdfSubmit = async () => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append('file', pdfFile);

    const res = await fetch('http://localhost:5000/upload_pdf', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResponse(res.ok ? 'PDF envoyé avec succès !' : `Erreur: ${data.details}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
        <Sidebar/>
    <div className="flex-1 p-6 overflow-auto  min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-10">
        <motion.h1 
          className="text-4xl font-semibold text-gray-900" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          Mon CV
        </motion.h1>
        <p className="text-gray-600">Sélectionnez un mode puis remplissez les champs</p>
      </header>

      <div className="flex gap-6 justify-center mb-8">
        <motion.button
          className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300"
          onClick={() => setMode('form')}
          whileHover={{ scale: 1.05 }}
        >
          Remplir le formulaire
        </motion.button>
        <motion.button
          className="bg-gray-300 text-gray-800 py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300"
          onClick={() => setMode('pdf')}
          whileHover={{ scale: 1.05 }}
        >
          Télécharger un PDF
        </motion.button>
      </div>

      {mode === 'form' && (
          <>
          <motion.section 
            className="bg-white p-8 rounded-lg shadow-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Informations Personnelles</h2>
            <div className="flex items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex justify-center items-center">
                <label htmlFor="photo" className="cursor-pointer">
                  <input 
                    type="file" 
                    id="photo" 
                    name="photo" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                  />
                  <Camera className="w-8 h-8 text-gray-500" />
                </label>
              </div>
              <div className="ml-6 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {['nom', 'prenom', 'dateNaissance', 'adresse', 'email', 'telephone', 'nationalite', 'situationMaritale', 'permis'].map(field => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input
                        id={field}
                        name={field}
                        type={field === 'email' ? 'email' : 'text'}
                        className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={(formData as any)[field] || ''}
                        onChange={e => handleChange(e)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
      
          <motion.section 
            className="bg-white p-8 rounded-lg shadow-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="cv-section-title">Situation Actuelle</h2>
            <div className="cv-field">
              <label htmlFor="situationActuelle">Situation Actuelle</label>
              <textarea
                id="situationActuelle"
                name="situationActuelle"
                value={formData.situationActuelle}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </motion.section>
      
          <motion.section 
            className="bg-white p-8 rounded-lg shadow-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="cv-section-title">Formations</h2>
            {formData.formations.map((_, idx) => (
              <div key={idx} className="cv-grid-2">
                {['type', 'etablissement', 'de', 'a'].map((key) => (
                  <div key={key} className="cv-field">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      name={key}
                      value={(formData.formations[idx] as any)[key]}
                      onChange={(e) => handleArrayChange(e, 'formations', idx)}
                    />
                  </div>
                ))}
                <div className="cv-field col-span-full">
                  <label>Détails</label>
                  <textarea
                    name="text"
                    value={formData.formations[idx].text}
                    onChange={(e) => handleArrayChange(e, 'formations', idx)}
                  />
                </div>
                <button aria-label="Supprimer cet élément" type="button" onClick={() => removeItemFromArray('formations', idx)} className="ml-2 text-red-500 hover:text-red-700 transition-colors">
                  suprimer ✖
                </button>
              </div>
            ))}
            <button className="cv-button-secondary" onClick={() => addItemToArray('formations')}>
              + Ajouter une formation
            </button>
          </motion.section>
      
          <motion.section 
            className="bg-white p-8 rounded-lg shadow-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="cv-section-title">Stages</h2>
            {formData.stages.map((_, idx) => (
              <div key={idx} className="cv-grid-2">
                {['intituleStage', 'dateStage', 'anneeStage'].map((key) => (
                  <div key={key} className="cv-field">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      name={key}
                      value={(formData.stages[idx] as any)[key]}
                      onChange={(e) => handleArrayChange(e, 'stages', idx)}
                    />
                  </div>
                ))}
                <div className="cv-field col-span-full">
                  <label>Description</label>
                  <textarea
                    name="descriptionStage"
                    value={formData.stages[idx].descriptionStage}
                    onChange={(e) => handleArrayChange(e, 'stages', idx)}
                  />
                </div>
                <button aria-label="Supprimer cet élément" type="button" onClick={() => removeItemFromArray('stages', idx)} className="ml-2 text-red-500 hover:text-red-700 transition-colors">
                  suprimer ✖
                </button>
              </div>
            ))}
            <button className="cv-button-secondary" onClick={() => addItemToArray('stages')}>
              + Ajouter un stage
            </button>
          </motion.section>
      
          <motion.section 
            className="bg-white p-8 rounded-lg shadow-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="cv-section-title">Expériences Professionnelles</h2>
            {formData.experiencesProfessionnelles.map((exp, idx) => (
              <div key={idx} className="cv-grid-2">
                {['poste', 'etablissementExp', 'deExp', 'aExp'].map((key) => (
                  <div key={key} className="cv-field">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      name={key}
                      value={(formData.experiencesProfessionnelles[idx] as any)[key]}
                      onChange={(e) => handleArrayChange(e, 'experiencesProfessionnelles', idx)}
                    />
                  </div>
                ))}
                <div className="cv-field col-span-full">
                  <label>Description</label>
                  <textarea
                    name="descriptionExp"
                    value={formData.experiencesProfessionnelles[idx].descriptionExp}
                    onChange={(e) => handleArrayChange(e, 'experiencesProfessionnelles', idx)}
                  />
                </div>
                <div className="cv-field col-span-full">
                  <label>Réalisations</label>
                  {exp.achievement.map((ach, aIdx) => (
                    <div key={aIdx} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={ach}
                        onChange={(e) => {
                          const updated = [...formData.experiencesProfessionnelles];
                          updated[idx].achievement[aIdx] = e.target.value;
                          setFormData({ ...formData, experiencesProfessionnelles: updated });
                        }}
                      />
                      <button type="button" onClick={() => removeAchievementFromExperience(idx, aIdx)}>✖</button>
                    </div>
                  ))}
                  <button type="button" className="cv-button-secondary" onClick={() => addAchievementToExperience(idx)}>
                    + Ajouter une réalisation
                  </button>
                </div>
                <button aria-label="Supprimer cet élément" type="button" onClick={() => removeItemFromArray('experiencesProfessionnelles', idx)} className="ml-2 text-red-500 hover:text-red-700 transition-colors">
                  suprimer ✖
                </button>
              </div>
            ))}
            <button className="cv-button-secondary" onClick={() => addItemToArray('experiencesProfessionnelles')}>
              + Ajouter une expérience
            </button>
          </motion.section>
      
          <motion.section 
            className="bg-white p-8 rounded-lg shadow-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="cv-section-title">Compétences</h2>
            {formData.competences.map((_, idx) => (
              <div key={idx} className="cv-grid-2">
                {['titre', 'description'].map((key) => (
                  <div key={key} className="cv-field">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      name={key}
                      value={(formData.competences[idx] as any)[key]}
                      onChange={(e) => handleArrayChange(e, 'competences', idx)}
                    />
                  </div>
                ))}
                <button aria-label="Supprimer cet élément" type="button" onClick={() => removeItemFromArray('competences', idx)} className="ml-2 text-red-500 hover:text-red-700 transition-colors">
                  suprimer ✖
                </button>
              </div>
            ))}
            <button className="cv-button-secondary" onClick={() => addItemToArray('competences')}>
              + Ajouter une compétence
            </button>
          </motion.section>
      
          <motion.section 
            className="bg-white p-8 rounded-lg shadow-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="cv-section-title">Langues</h2>
            {formData.langues.map((_, idx) => (
              <div key={idx} className="cv-grid-2">
                {['intitule', 'niveau'].map((key) => (
                  <div key={key} className="cv-field">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <input
                      name={key}
                      value={(formData.langues[idx] as any)[key]}
                      onChange={(e) => handleArrayChange(e, 'langues', idx)}
                    />
                  </div>
                ))}
               <button aria-label="Supprimer cet élément" type="button" onClick={() => removeItemFromArray('langues', idx)} className="ml-2 text-red-500 hover:text-red-700 transition-colors">
                  suprimer ✖
                </button>
              </div>
            ))}
            <button className="cv-button-secondary" onClick={() => addItemToArray('langues')}>
              + Ajouter une langue
            </button>
          </motion.section>
      
          <motion.section 
            className="bg-white p-8 rounded-lg shadow-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="cv-section-title">Loisirs</h2>
            {formData.loisirs.map((_, idx) => (
              <div key={idx} className="cv-field">
                <input
                  value={formData.loisirs[idx]}
                  onChange={(e) => handleArrayChange(e, 'loisirs', idx)}
                />
                <button aria-label="Supprimer cet élément" type="button" onClick={() => removeItemFromArray('loisirs', idx)} className="ml-2 text-red-500 hover:text-red-700 transition-colors">
                  suprimer ✖
                </button>
              </div>
            ))}
            <button className="cv-button-secondary" onClick={() => addItemToArray('loisirs')}>
              + Ajouter un loisir
            </button>
          </motion.section>

          <section className="cv-section">
            <h2 className="cv-section-title">Références</h2>
            <div className="cv-grid-2">
              <div className="cv-field">
                <label>Email</label>
                <input
                  name="emailReference"
                  value={formData.emailReference}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="cv-field">
                <label>Téléphone</label>
                <input
                  name="telephoneReference"
                  value={formData.telephoneReference}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div className="cv-grid-2">
              <div className="cv-field">
                <label>Site Web</label>
                <input
                  name="webReference"
                  type="url"
                  value={formData.webReference}
                  onChange={(e) => handleChange(e)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="cv-field">
                <label>Nom</label>
                <input
                  name="nomReference"
                  value={formData.nomReference}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div className="cv-field">
              <label>Relation</label>
              <input
                name="relationReference"
                value={formData.relationReference}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </section>

          <div className="text-center mt-8">
            <button className="cv-button" onClick={handleFormSubmit}>Soumettre le CV</button>
            {response && (
  <p className="mt-4 text-center text-green-600 font-semibold">{response}</p>
)}  
          </div>
        </>
      )}
    </div>
    </div>
  );
}

