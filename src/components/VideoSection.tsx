import { motion } from "framer-motion";

const VideoSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12"
      >
        <div className="relative rounded-sm overflow-hidden border border-border box-glow">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto object-cover"
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
      </motion.div>
    </section>
  );
};

export default VideoSection;
