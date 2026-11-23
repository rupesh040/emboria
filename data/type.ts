export interface SocialLink {
  name: string;
  icon: string;
  href: string;
}

export interface WorkingHoursInfo {
  icon: string;
  prefix: string;
  time: string;
}

export interface EmailInfo {
  icon: string;
  prefix: string;
  address: string;
  href: string;
}

export interface TopBarData {
  workingHours: WorkingHoursInfo;
  email: EmailInfo;
  socialLinks: SocialLink[];
}

export interface NavLinkItem {
  name: string;
  href: string;
  active?: boolean;
}

export interface CallActionData {
  title: string;
  phone: string;
  href: string;
  icon: string;
}

export interface HeaderVariant {
  topBar: TopBarData;
  logo: string;
  logoAlt: string;
  links: NavLinkItem[];
  callAction: CallActionData;
}

export interface HeaderSection {
  variants: {
    [key: string]: HeaderVariant;
  };
}

export interface HeroVariant {
  tagline: string;
  taglineDivider?: boolean;
  heading: string;
  headingPart1: string;
  headingPart2: string;
  description: string;
  backgroundImage: string;
  imageAlt: string;
  ctaButton?: {
    text: string;
    href: string;
  };
}

export interface HeroSection {
  variants: {
    [key: string]: HeroVariant;
  };
}

export interface SocialProofAvatar {
  image: string;
  alt: string;
}

export interface SocialProofData {
  avatars: SocialProofAvatar[];
  badge: string;
  labelPart1: string;
  labelPart2: string;
}

export interface AboutFeature {
  title: string;
}

export interface AboutImageItem {
  src: string;
  alt: string;
}

export interface AboutImagesData {
  front: AboutImageItem;
  back: AboutImageItem;
}

export interface AboutVariant {
  tagline: string;
  taglineDivider?: boolean;
  heading: string;
  headingPart1: string;
  headingPart2: string;
  description: string;
  socialProof: SocialProofData;
  features: AboutFeature[];
  images: AboutImagesData;
}

export interface AboutSection {
  variants: {
    [key: string]: AboutVariant;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
}

export interface ServicesVariant {
  tagline: string;
  taglineDividers?: boolean;
  heading: string;
  headingPart1: string;
  headingPart2: string;
  items: ServiceItem[];
}

export interface ServicesSection {
  variants: {
    [key: string]: ServicesVariant;
  };
}

export interface WhyChooseFeature {
  icon: string;
  title: string;
  description: string;
}

export interface CustomerAvatar {
  image: string;
  alt: string;
}

export interface WhyChooseBadgeCard {
  count: string;
  label: string;
  avatars: CustomerAvatar[];
}

export interface WhyChooseImageItem {
  src: string;
  alt: string;
}

export interface WhyChooseImages {
  main: WhyChooseImageItem;
  topRight: WhyChooseImageItem;
  bottomRight: WhyChooseImageItem;
}

export interface WhyChooseUsVariant {
  tagline: string;
  taglineDivider?: boolean;
  headingPart1: string;
  headingPart2: string;
  headingHighlight: string;
  description: string;
  features: WhyChooseFeature[];
  badgeCard: WhyChooseBadgeCard;
  images: WhyChooseImages;
}

export interface WhyChooseUsSection {
  variants: {
    [key: string]: WhyChooseUsVariant;
  };
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  image: string;
  imageAlt: string;
  quote: string;
}

export interface TestimonialsVariant {
  tagline: string;
  taglineDividers?: boolean;
  headingPart1: string;
  headingHighlight: string;
  description: string;
  items: TestimonialItem[];
}

export interface TestimonialsSection {
  variants: {
    [key: string]: TestimonialsVariant;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQImage {
  src: string;
  alt: string;
}

export interface FAQVariant {
  tagline: string;
  taglineDividers?: boolean;
  headingPart1: string;
  headingHighlight: string;
  description: string;
  image: FAQImage;
  items: FAQItem[];
}

export interface FAQSection {
  variants: {
    [key: string]: FAQVariant;
  };
}

export interface ContactInfoItem {
  id: string;
  title: string;
  value: string;
  href?: string;
}

export interface ContactImage {
  src: string;
  alt: string;
}

export interface ContactFormData {
  title: string;
  description: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  servicePlaceholder: string;
  servicesOptions: string[];
  messagePlaceholder: string;
  buttonText?: string;
  successMessage?: string;
}

export interface ContactVariant {
  tagline: string;
  taglineDivider?: boolean;
  headingPart1: string;
  headingHighlight: string;
  description: string;
  contactInfo: ContactInfoItem[];
  image: ContactImage;
  form: ContactFormData;
}

export interface ContactSection {
  variants: {
    [key: string]: ContactVariant;
  };
}

export interface FooterLinkItem {
  name: string;
  href: string;
}

export interface FooterContactItem {
  id: string;
  icon: string;
  value: string;
  href?: string;
}

export interface FooterVariant {
  logo: string;
  logoAlt: string;
  description: string;
  quickLinksTitle: string;
  quickLinks: FooterLinkItem[];
  supportTitle: string;
  supportLinks: FooterLinkItem[];
  contactTitle: string;
  contactItems: FooterContactItem[];
  copyright: string;
}

export interface FooterSection {
  variants: {
    [key: string]: FooterVariant;
  };
}

export interface ComponentReference {
  key: string;
  component: string;
}

export interface PageDefinition {
  components: ComponentReference[];
}

export interface TemplateDefinition {
  shared: {
    Header: string;
    Footer?: string;
    [key: string]: string | undefined;
  };
  pages: {
    [pageKey: string]: PageDefinition;
  };
}

export interface EmboriaSiteData {
  Emboria: {
    templateComponents: {
      [templateId: string]: TemplateDefinition;
    };
    sections: {
      Header: HeaderSection;
      Hero: HeroSection;
      About: AboutSection;
      Services: ServicesSection;
      WhyChooseUs: WhyChooseUsSection;
      Testimonials: TestimonialsSection;
      FAQ: FAQSection;
      Contact: ContactSection;
      Footer: FooterSection;
      [sectionKey: string]: unknown;
    };
  };
}
