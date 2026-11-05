window.OREKA_COLOR_DEFAULTS = {
  bg: "#fff7fb",
  surface: "#ffffff",
  ink: "#2a1220",
  muted: "#5c3a4a",
  faint: "#7a5364",
  pink: "#f61c96",
  pink2: "#d01278",
  pinkSoft: "#c2187a",
  inkOnPink: "#2a1220",
  linkHover: "#8d105c",
  line: "#e01386",
  alert: "#9d1048",
  memberLight: "#ff8ec4",
  memberLight2: "#ffe3f1"
};

window.OREKA_TEXT_GROUPS = [
  {
    title: "Page et partage",
    fields: [
      ["pageTitle", "Titre de l’onglet", "OREKA — Projet hôtelier de l’IAE Metz"],
      ["metaDescription", "Description pour les moteurs", "Site officiel d’OREKA, 13 étudiantes et étudiants de l’IAE Metz en management et développement de systèmes hôteliers. Compte à rebours du jour J, partenaires et formulaire.", true],
      ["ogTitle", "Titre du partage", "OREKA — Le jour J, les partenaires"],
      ["ogDescription", "Texte du partage", "13 étudiants de l’IAE Metz. Jour J indicatif le 20 avril 2027. Hôtels, restaurants, traiteurs, animateurs et DJ.", true],
      ["twitterTitle", "Titre court du partage", "OREKA — Metz"],
      ["twitterDescription", "Texte court du partage", "OREKA, projet de l’IAE Metz. Jour J indicatif le 20 avril 2027, partenaires et formulaire.", true],
      ["schemaName", "Nom dans les données du site", "OREKA"],
      ["schemaDescription", "Description dans les données du site", "Projet de 13 étudiantes et étudiants de l’IAE Metz, en management et développement de systèmes hôteliers.", true],
      ["schemaCity", "Ville dans les données du site", "Metz"],
      ["brandLabel", "Nom lu pour le logo", "Oreka Metz"],
      ["heroLogoAlt", "Texte alternatif du grand logo", "OREKA"],
      ["skipLink", "Lien d’accès direct", "Aller au contenu"],
      ["noscript", "Message si JavaScript est désactivé", "Le texte du site reste lisible. Activez JavaScript pour le compte à rebours, la liste des partenaires et le formulaire.", true],
      ["previewBanner", "Bandeau de l’aperçu", "Aperçu local. Le site public n’affiche ce brouillon qu’après publication."]
    ]
  },
  {
    title: "Navigation",
    fields: [
      ["navMenu", "Bouton pour ouvrir le menu", "Menu"],
      ["navClose", "Bouton pour fermer le menu", "Fermer"],
      ["navAria", "Nom du menu", "Navigation principale"],
      ["navJour", "Lien Jour J", "Jour J"],
      ["navPartners", "Lien Partenaires", "Partenaires"],
      ["navProject", "Lien du projet", "OREKA"],
      ["navMentions", "Lien Mentions", "Mentions"],
      ["navCta", "Bouton du menu", "Devenir partenaire"]
    ]
  },
  {
    title: "Compte à rebours",
    help: "La ligne au-dessus du compteur et la phrase en dessous se règlent dans la carte Date. Ici, le reste de cette zone.",
    fields: [
      ["heroTitle", "Titre lu du compte à rebours", "Oreka Metz, compte à rebours du jour J"],
      ["unitDays", "Unité des jours", "jours"],
      ["unitHours", "Unité des heures", "heures"],
      ["unitMinutes", "Unité des minutes", "minutes"],
      ["unitSeconds", "Unité des secondes", "secondes"],
      ["heroCta", "Bouton principal", "Devenir partenaire"],
      ["heroSecondary", "Bouton secondaire", "Lire la présentation"],
      ["countReached", "Phrase quand la date est passée", "La date indicative du jour J est atteinte."],
      ["countBefore", "Phrase lue pendant le compte à rebours", "{days} {unitDays}, {hours} {unitHours} et {minutes} {unitMinutes} avant le jour J, date indicative du {when}.", true]
    ]
  },
  {
    title: "Partenaires",
    fields: [
      ["sectionIndex1", "Numéro de la section", "01"],
      ["partnersEyebrow", "Petit titre", "Partenaires"],
      ["partnersTitle", "Titre", "Une liste qui tourne."],
      ["partnersIntro", "Introduction", "Hôtels, restaurants et traiteurs pour le projet. Animateurs et DJ pour le jour de l’événement. Faites tourner la liste, ou choisissez une carte.", true],
      ["reelLabel", "Nom de la liste tournante", "Partenaires"],
      ["reelRole", "Type de liste lu à voix haute", "carrousel"],
      ["reelPrev", "Bouton précédent", "Partenaire précédent"],
      ["reelNext", "Bouton suivant", "Partenaire suivant"],
      ["reelEmpty", "Phrase avant de choisir une carte", "Choisissez une carte, ou laissez la liste tourner."],
      ["partnersHint", "Note sous la liste", "Dès qu’un partenaire confirme, son nom ou son logo prend la place de la carte."]
    ]
  },
  {
    title: "Présentation",
    help: "Les mots {n}, {who} et {role} sont remplacés par le numéro, le nom et le rôle.",
    fields: [
      ["projectEyebrow", "Petit titre", "Le projet"],
      ["projectTitle", "Titre", "Treize membres, à l’IAE Metz."],
      ["projectBody", "Présentation", "OREKA réunit 13 étudiantes et étudiants en management et développement de systèmes hôteliers. Le groupe construit un réseau, invite des partenaires, et prépare le jour J.", true],
      ["memberCaption", "Légende sous les membres", "13 membres du projet, IAE Metz."],
      ["memberEmpty", "Nom lu d’un membre sans nom", "Membre {n} du projet, IAE Metz."],
      ["memberWithName", "Nom lu d’un membre nommé", "{who}, membre du projet, IAE Metz."],
      ["memberWithRole", "Nom lu d’un rôle sans nom", "Membre {n}, {role}."],
      ["memberNumberName", "Libellé si seul le rôle est rempli", "Membre {n}"]
    ]
  },
  {
    title: "Formulaire",
    help: "Les mots entre accolades sont remplacés tout seuls. {place} et {role} viennent du choix. {org} est l’établissement. {value} est la valeur de la ligne. {n} est le nombre de points manquants.",
    fields: [
      ["sectionIndex2", "Numéro de la section", "02"],
      ["formEyebrow", "Petit titre", "Devenir partenaire"],
      ["formTitle", "Titre", "Un petit formulaire."],
      ["formIntro", "Introduction", "Choisissez votre place, puis laissez un nom, un établissement et un e-mail.", true],
      ["honeypotLabel", "Libellé du champ invisible", "Société"],
      ["roleLegend", "Titre du choix", "Vous êtes"],
      ["roleGroupProject", "Groupe du projet", "Pour le projet"],
      ["roleGroupEvent", "Groupe du jour J", "Pour le jour de l’événement"],
      ["roleHotel", "Choix hôtel", "Hôtel"],
      ["roleRestaurant", "Choix restaurant", "Restaurant"],
      ["roleTraiteur", "Choix traiteur", "Traiteur"],
      ["roleAnimateur", "Choix animateur", "Animateur"],
      ["roleDj", "Choix DJ", "DJ"],
      ["placePrompt", "Phrase tant qu’aucun choix n’est fait", "Choisissez hôtel, restaurant, traiteur, animateur ou DJ."],
      ["placeProject", "Place du projet dans la phrase", "du projet"],
      ["placeEvent", "Place du jour J dans la phrase", "du jour J"],
      ["sentencePartner", "Phrase du choix", "Partenaire {place} : {role}."],
      ["sentenceOrg", "Phrase de l’établissement", "Établissement : {org}."],
      ["statusWait", "État en attente", "En attente"],
      ["statusReady", "État après le choix", "Place esquissée"],
      ["labelNom", "Champ nom", "Nom"],
      ["labelStructure", "Champ établissement", "Établissement"],
      ["labelEmail", "Champ e-mail", "E-mail"],
      ["labelMessage", "Champ message", "Message"],
      ["labelOptional", "Mention facultatif", "(facultatif)"],
      ["messagePlaceholder", "Exemple dans le message", "Un mot suffit, si vous voulez préciser."],
      ["consent", "Phrase de confirmation", "Je confirme que ces informations peuvent être transmises au collectif OREKA, uniquement pour répondre à ma demande de partenariat.", true],
      ["mentionsLink", "Lien vers les mentions", "Mentions légales"],
      ["submitPrepare", "Bouton de préparation", "Préparer la demande"],
      ["formHint", "Note sous le bouton", "Vous voyez le message avant qu’il soit transmis."],
      ["errRole", "Erreur de choix", "Choisissez un type de partenaire."],
      ["errLinkRole", "Lien de l’erreur de choix", "Choisir un type"],
      ["errNom", "Erreur de nom", "Indiquez votre nom."],
      ["errLinkNom", "Lien de l’erreur de nom", "Nom"],
      ["errStructure", "Erreur d’établissement", "Indiquez l’établissement."],
      ["errLinkStructure", "Lien de l’erreur d’établissement", "Établissement"],
      ["errEmail", "Erreur d’e-mail", "Indiquez un e-mail valide."],
      ["errLinkEmail", "Lien de l’erreur d’e-mail", "E-mail"],
      ["errConsent", "Erreur de confirmation", "Confirmez l’usage de ces informations."],
      ["errLinkConsent", "Lien de l’erreur de confirmation", "Confirmation"],
      ["errCountOne", "Résumé pour un point manquant", "Il reste {n} point à compléter."],
      ["errCountMany", "Résumé pour plusieurs points", "Il reste {n} points à compléter."],
      ["waitHint", "Message si le formulaire est envoyé trop vite", "Merci de relire le formulaire un instant avant de préparer la demande."],
      ["successEyebrow", "Petit titre de confirmation", "Partenariat"],
      ["successReadyTitle", "Titre avant l’envoi", "Demande prête"],
      ["successReadyLead", "Texte avant l’envoi", "Relisez le message. Il n’est pas encore envoyé. Confirmez pour le transmettre au collectif, ou ouvrez-le dans votre e-mail.", true],
      ["successSentTitle", "Titre après l’envoi", "Demande envoyée"],
      ["successSentLead", "Texte après l’envoi", "Le collectif a reçu votre message et peut vous répondre à l’adresse indiquée.", true],
      ["confirmSend", "Bouton d’envoi", "Envoyer la demande"],
      ["sendingLabel", "Bouton pendant l’envoi", "Envoi…"],
      ["openMail", "Bouton de messagerie", "Ouvrir dans l’e-mail"],
      ["copyMessage", "Bouton de copie", "Copier le message"],
      ["copyDone", "Copie réussie", "Message copié"],
      ["copyFail", "Copie impossible", "Copie impossible"],
      ["newRequest", "Bouton d’une nouvelle demande", "Nouvelle demande"],
      ["rateLimit", "Message si trop de demandes partent", "Plusieurs demandes viennent d’être envoyées depuis ce navigateur. Réessayez plus tard, ou ouvrez le message dans votre e-mail.", true],
      ["mailHeading", "Première ligne du message", "Demande de partenariat — OREKA"],
      ["mailDate", "Ligne de date", "Date : {value}"],
      ["mailName", "Ligne du nom", "Nom : {value}"],
      ["mailStructure", "Ligne de l’établissement", "Établissement : {value}"],
      ["mailPlace", "Ligne de la place", "Place : partenaire {value}"],
      ["mailType", "Ligne du type", "Type : {value}"],
      ["mailEmail", "Ligne de l’e-mail", "E-mail : {value}"],
      ["mailSubject", "Objet de l’e-mail", "Partenariat OREKA — {value}"]
    ]
  },
  {
    title: "Pied de page",
    fields: [
      ["footer", "Phrase sous le logo", "Site officiel d’OREKA, projet de 13 étudiants de l’IAE Metz."],
      ["footerExplore", "Titre de la colonne", "Explorer"],
      ["footJour", "Lien du jour J", "Le jour J"],
      ["footPartners", "Lien des partenaires", "Les partenaires"],
      ["footProject", "Lien du projet", "Le projet"],
      ["footJoin", "Lien du formulaire", "Devenir partenaire"],
      ["copyright", "Ligne de copyright", "© 2026 Collectif OREKA"],
      ["footMentions", "Lien des mentions", "Mentions légales"],
      ["backHome", "Retour au site", "Retour au site"]
    ]
  },
  {
    title: "Page introuvable",
    fields: [
      ["lostPageTitle", "Titre de l’onglet", "Page introuvable — OREKA"],
      ["lostEyebrow", "Petit titre", "Erreur 404"],
      ["lostTitle", "Titre", "Cette page n’est pas dans le réseau."],
      ["lostLead", "Texte", "Le lien est introuvable. Le site du collectif, lui, est toujours là."],
      ["lostHome", "Bouton d’accueil", "Retour à l’accueil"],
      ["lostCta", "Bouton partenaire", "Devenir partenaire"]
    ]
  },
  {
    title: "Mentions légales",
    help: "L’adresse affichée change le lien mailto de cette page. L’envoi du formulaire continue d’utiliser l’adresse déjà branchée.",
    fields: [
      ["mentionsTitle", "Titre de l’onglet", "Mentions légales — OREKA"],
      ["mentionsDescription", "Description de la page", "Mentions légales du site officiel du collectif universitaire OREKA, à Metz.", true],
      ["mentionsEyebrow", "Petit titre", "Collectif OREKA · Metz"],
      ["mentionsH1", "Titre", "Mentions légales"],
      ["mentionsEditorH", "Titre éditeur", "Éditeur"],
      ["mentionsEditor", "Texte éditeur", "Le site est le site officiel d’OREKA, projet de 13 étudiantes et étudiants de l’IAE Metz, en management et développement de systèmes hôteliers. Il présente le groupe et recueille des propositions de partenariat : hôtels, restaurants et traiteurs pour le projet, animateurs et DJ pour le jour de l’événement.", true],
      ["mentionsHostH", "Titre hébergement", "Hébergement"],
      ["mentionsHost", "Texte hébergement", "Le site est hébergé gratuitement par GitHub Pages, service de GitHub, Inc., San Francisco, États-Unis. La consultation se fait en HTTPS.", true],
      ["mentionsSignH", "Titre du signe", "Signe et textes"],
      ["mentionsSign", "Texte du signe", "Le logo affiché est le fichier officiel : le ruban rose, le cercle, le mot Oreka, Metz, les deux points roses, et la ligne « Le QG de l’hospitalité · Metz 2026 ». Le compte à rebours vise une date indicative, le mardi 20 avril 2027. Le collectif confirmera le jour exact. Les textes présentent le projet à partir des éléments communiqués par le groupe : 13 membres, étudiants à l’IAE Metz, un appel aux hôtels, restaurants et traiteurs, et un appel aux animateurs et DJ pour le jour de l’événement.", true],
      ["mentionsDataH", "Titre des données", "Données personnelles"],
      ["mentionsData", "Ce que le formulaire demande", "Le formulaire « Devenir partenaire » demande un type de partenaire, un nom, un établissement, un e-mail et, si vous le souhaitez, un court message. Ces informations servent uniquement à répondre à la demande de partenariat.", true],
      ["mentionsDataFlow", "Texte avant l’adresse", "La demande s’affiche d’abord dans votre navigateur. Elle n’est transmise qu’après votre confirmation, vers"],
      ["mentionsInbox", "Adresse affichée", "siahmedalaa@gmail.com"],
      ["mentionsDataFlow2", "Texte après l’adresse", ", par le service FormSubmit. Cette étape peut demander une vérification anti-spam. Vous pouvez aussi ouvrir le message dans votre messagerie ou le copier. Un brouillon peut rester dans la session de votre navigateur, sur votre appareil, jusqu’à la fermeture de l’onglet ou jusqu’à l’envoi.", true],
      ["mentionsDataKeep", "Conservation et suppression", "Les messages restent dans cette boîte mail jusqu’à ce que le collectif les supprime. Pour demander l’accès, la correction ou la suppression de vos informations, écrivez à cette même adresse. Le site ne dépose pas de cookie de suivi. Les polices sont servies par le site lui-même.", true],
      ["mentionsContactH", "Titre du contact", "Contact"],
      ["mentionsContactLead", "Texte avant le lien", "Pour proposer un partenariat, utilisez la page"],
      ["mentionsContactCta", "Lien vers le formulaire", "Devenir partenaire"],
      ["mentionsContactMid", "Texte entre le lien et l’adresse", ". Les demandes arrivent à"],
      ["mentionsContactEnd", "Fin de la phrase", "."]
    ]
  }
];
