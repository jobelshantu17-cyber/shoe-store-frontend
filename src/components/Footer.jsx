export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© 2025 ShoeStore. All Rights Reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    height: "80px",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    marginTop: "20px",
  },
};
