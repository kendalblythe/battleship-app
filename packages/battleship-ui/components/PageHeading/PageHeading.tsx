import styles from "./PageHeading.module.scss";

export interface PageHeadingProps {
  text: string;
}

export const PageHeading = ({ text }: PageHeadingProps) => (
  <h2 className={styles.heading}>{text}</h2>
);
