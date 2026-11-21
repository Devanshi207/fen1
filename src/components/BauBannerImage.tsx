import Image from "next/image";

/** Home, under the hero text: the fair's own 728 x 90 banner, unchanged, linking to the exhibitor page. */
export default function BauBannerImage() {
  return (
    <a
      href="https://exhibitors.bau-muenchen.com/company/1559458"
      target="_blank"
      rel="noopener noreferrer"
      className="bau-strip hero-seq"
      style={{ ["--hs" as string]: "800ms" }}
    >
      <Image src="/bau/bau-banner-728x90.jpg" alt="BAU 2027, January 11 to 15, Messe München. Visit us at BAU in Hall B4, Stand 527." width={728} height={90} unoptimized />
    </a>
  );
}
