import { Container } from "@/components/layout/Container";
import { recentProjects } from "@/lib/data/projects";
import { ProjectCard } from "./ProjectCard";

export function RecentProjectsSection() {
  return (
    <section className="py-16 md:py-20 bg-neutral-50 dark:bg-primary-950 transition-colors">
      <Container>
        <div className="mb-10">
          <div className="w-16 h-1 bg-cta-500 mb-4 rounded-full" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-white font-heading mb-3">
            Travaux recemment publies
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Decouvrez les derniers memoires publies par les etudiants de l'ESPA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}