const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-300 text-primary font-semibold p-4">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All rights reserved Task
          Manager App
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
