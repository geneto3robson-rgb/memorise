"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { Project } from "@/lib/data/projects";
import { useFavoris } from "@/lib/favoris-context";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { favoris, toggle } = useFavoris();
  const isSaved = favoris.includes(project.id);

  return (
    <article className="group flex flex-col rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-primary-900 hover:border-cta-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className={`absolute top-3 left-3 ${project.filiereColor} text-white text-xs font-medium px-3 py-1 rounded-full`}>
          {project.filiere}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-primary-900 dark:text-white mb-3 line-clamp-2 leading-snug">
          {project.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full overflow-hidden relative shrink-0">
            <Image src={project.authorAvatar} alt={project.author} fill sizes="24px" className="object-cover" />
          </div>
          <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate">{project.author}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
          <span>{project.niveau}</span>
          <span>·</span>
          <span>{project.year}</span>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 truncate">
          Encadré par : {project.encadreur}
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-4">
          {project.summary}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <Link
            href={`/memoires/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-900 dark:text-white border-2 border-primary-900 dark:border-white rounded-full px-3 py-1.5 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors"
          >
            Voir le détail
            <ArrowUpRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => toggle(project.id)}
            aria-label={isSaved ? "Retirer des favoris" : "Enregistrer"}
            className={`transition-colors ${
              isSaved
                ? "text-primary-500 dark:text-cta-500"
                : "text-primary-900 dark:text-white hover:text-primary-500 dark:hover:text-cta-500"
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
}