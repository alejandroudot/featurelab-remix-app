import type { JSX } from 'react';
import {
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type LexicalNode,
  type NodeKey,
} from 'lexical';

type SerializedImageNode = {
  // Debe coincidir con getType().
  type: 'image';
  // Version del contrato JSON para futuras migraciones.
  version: 1;
  // URL final o data URL temporal de preview.
  src: string;
  // Texto alternativo para accesibilidad.
  altText: string;
};

// Nodo custom de Lexical para representar una imagen inline en el documento.
// Se serializa a JSON y tambien soporta import/export DOM (img).
// Elegimos DecoratorNode porque su contenido visual lo renderiza React (decorate),
// no un simple texto/elemento nativo manejado directamente por Lexical.
export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;

  // Identificador unico del tipo de nodo dentro de Lexical.
  static getType(): string {
    return 'image';
  }

  // Lexical usa clone internamente en operaciones de update.
  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  // Reconstruye nodo desde estado serializado (persistencia/editor state).
  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(serializedNode.src, serializedNode.altText);
  }

  // Como se guarda este nodo en JSON dentro del estado de Lexical.
  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        // Permite transformar <img> del HTML pegado/importado en nuestro nodo ImageNode.
        conversion: (domNode: Node): DOMConversionOutput | null => {
          if (!(domNode instanceof HTMLImageElement)) return null;
          return {
            node: new ImageNode(domNode.getAttribute('src') ?? '', domNode.getAttribute('alt') ?? ''),
          };
        },
        priority: 1,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    // Define como vuelve a salir a HTML cuando exportamos el documento.
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    if (this.__altText) {
      element.setAttribute('alt', this.__altText);
    }
    return { element };
  }

  constructor(src: string, altText = '', key?: NodeKey) {
    // key lo gestiona Lexical; solo lo pasamos cuando el framework lo necesita.
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  // API minima para leer src desde operaciones/editor plugins.
  getSrc(): string {
    return this.__src;
  }

  setSrc(src: string): void {
    // getWritable es obligatorio en Lexical para mutar nodos de forma segura.
    // Nunca se muta this.__src directo fuera de un writable clone.
    const writable = this.getWritable();
    writable.__src = src;
  }

  createDOM(): HTMLElement {
    // Host element del DecoratorNode. El <img> real lo devuelve decorate().
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    return span;
  }

  updateDOM(): false {
    // false => Lexical desmonta/remonta el decorator cuando cambia el nodo.
    // Es lo esperado para un nodo React decorado simple como imagen.
    return false;
  }

  decorate(): JSX.Element {
    // Render visual del nodo dentro del editor.
    return <img src={this.__src} alt={this.__altText} className="h-auto max-w-full rounded" />;
  }
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  // Type guard para evitar casts inseguros al recorrer nodos.
  return node instanceof ImageNode;
}

export function $createImageNode(src: string, altText = ''): ImageNode {
  // Factory consistente con convencion Lexical ($createXNode).
  return new ImageNode(src, altText);
}

