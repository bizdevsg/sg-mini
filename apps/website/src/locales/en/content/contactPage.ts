import type { AppMessages } from "../../shared/messages";

export const enContactPage: AppMessages["contactPage"] = {
    title: "Contact Us",
    description:
      "PT. Solid Gold Berjangka contact page with a message form, head office map, and official customer support information.",
    breadcrumb: "Contact Us",
    breadcrumbs: {
      supportCenter: "Support Center",
    },
    complaintLinks: {
      onlineComplaint: "Online Complaint",
      emailComplaint: "Submit Complaint by Email",
    },
    hero: {
      eyebrow: "Official Contact",
      title: "CONTACT US",
      description:
        "PT. Solid Gold Berjangka offices are present in Jakarta and selected operating cities across Indonesia.",
    },
    overview: {
      eyebrow: "Primary Contact",
      title: "Official Contact Information",
      description:
        "Use the details below to reach the head office, open the location map, or submit a complaint through the official channels.",
      companyLabel: "Company",
      addressLabel: "Address",
      updatedLabel: "Last updated",
    },
    form: {
      title: "Send Us a Message",
      description:
        "Fill in your details briefly. Your message will be sent directly to PT. Solid Gold Berjangka's official contact system.",
      nameLabel: "Name",
      namePlaceholder: "Your full name",
      emailLabel: "Email",
      emailPlaceholder: "name@email.com",
      phoneLabel: "Phone Number",
      phonePlaceholder: "08xxxxxxxxxx",
      subjectLabel: "Subject",
      subjectPlaceholder: "Example: Account opening inquiry",
      messageLabel: "Message",
      messagePlaceholder:
        "Write your question, request, or issue in a concise way.",
      captchaLabel: "CAPTCHA",
      captchaAction: "Refresh",
      submit: "Send Message",
      submitting: "Sending...",
      helper:
        "For faster follow-up, you can also use the official customer support channels shown beside the form.",
      success: "Your message has been sent successfully.",
      successReportLabel: "Report ID",
      error: "Failed to send your message. Please try again.",
    },
    headOffice: {
      title: "SGB Head Office",
      address:
        "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220",
      email: "berjangka@solidgold.co.id",
      phone: "021-29675088",
      phoneHref: "tel:02129675088",
      fax: "021-29675089",
      complaintPhone: "021-29675088 ext. 116",
      complaintPhoneHref: "tel:02129675088",
    },
    map: {
      title: "Head Office Map",
      description:
        "You can open the PT. Solid Gold Berjangka head office location directly through the map below.",
      iframeTitle: "PT. Solid Gold Berjangka head office map",
      directionsCta: "Open Directions",
      directionsUrl:
        "https://www.google.com/maps/search/?api=1&query=TCC%20Batavia%20Tower%20One%20Lt.%2010%20Jl.%20K.H.%20Mas%20Mansyur%20Kav.%20126%20Jakarta%20Pusat%2010220",
    },
    support: {
      title: "Customer Support",
      description:
        "Choose the right official contact channel for general questions, direct communication, or complaint handling.",
      callTitle: "Phone",
      callDescription: "Main phone line for the head office.",
      emailTitle: "Email",
      emailDescription: "Official email address for general inquiries.",
      complaintTitle: "Complaint Unit",
      complaintDescription: "Use extension 116 for complaint handling.",
      complaintValue: "Official Complaint",
      faxTitle: "Fax",
      faxDescription: "Official company fax line.",
    },
    offices: {
      title: "SGB Branch Offices",
      description:
        "PT. Solid Gold Berjangka operating locations shown using the company's official public contact information.",
      phoneLabel: "Phone",
      emailLabel: "Email",
      faxLabel: "Fax",
      items: [
        {
          name: "Jakarta Head Office",
          address:
            "TCC Batavia, Tower One Lt. 10, Jl. K.H. Mas Mansyur Kav. 126, Jakarta Pusat 10220",
          phone: "021-29675088",
          phoneHref: "tel:02129675088",
          email: "berjangka@solidgold.co.id",
          fax: "021-29675089",
        },
        {
          name: "Semarang Office",
          address:
            "Gedung Menara SUARA MERDEKA Lt. 3, Jl. Pandanaran No. 30 Semarang 50134",
          phone: "024-3583979, 024-3583980",
          phoneHref: "tel:0243583979",
        },
        {
          name: "Makassar Office",
          address:
            "Pettarani Business Center, Jl. AP. Pettarani Kav. E9, Kel. Tidung, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90222",
        },
      ],
    },
  };
