import { $generateNodesFromDOM } from '@lexical/html';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  DecoratorNode,
  ElementNode,
  type LexicalEditor,
  type LexicalNode,
} from 'lexical';
import { $createImageNode, $isImageNode } from '../nodes/ImageNode';

// Operaciones puras sobre el estado Lexical (sin UI).
// Sirven para mantener la logica de transformacion fuera de los componentes.
//
// Mapa rapido de flujo (imagenes):
// 1) UI (toolbar o paste) dispara onPickImage en RichTextEditorShell.
// 2) useRichTextImageUpload llama:
//    - insertImageAtSelection(...) para preview local inmediata.
//    - replaceImageSrc(...) cuando el backend devuelve URL final.
//    - removeImageBySrc(...) si el upload falla.
// 3) Lexical renderiza cada imagen usando ImageNode.decorate().
//
// Mapa rapido de flujo (HTML):
// - setEditorHtml(...) hidrata estado inicial/external value dentro del editor.
// - Cuando ese HTML tiene <img>, Lexical usa ImageNode.importDOM() automaticamente.
export function setEditorHtml(editor: LexicalEditor, html: string) {
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    const source = html?.trim() ? html : '<p></p>';
    const dom = new DOMParser().parseFromString(source, 'text/html');
    const rawNodes = $generateNodesFromDOM(editor, dom);
    const nodes: LexicalNode[] = [];

    for (const node of rawNodes) {
      if ($isElementNode(node) || node instanceof DecoratorNode) {
        nodes.push(node);
        continue;
      }
      // Lexical root no acepta nodos sueltos de texto/decorator en cualquier contexto.
      // Si llega algo no-element, lo envolvemos en <p>.
      const paragraph = $createParagraphNode();
      paragraph.append(node);
      nodes.push(paragraph);
    }

    if (nodes.length === 0) {
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(''));
      root.append(paragraph);
      return;
    }

    root.append(...nodes);
  });
}

export function insertImageAtSelection(editor: LexicalEditor, src: string) {
  // Inserta imagen en la posicion actual del cursor.
  // Si no hay seleccion valida, la agrega al final del documento.
  editor.update(() => {
    const selection = $getSelection();
    const imageNode = $createImageNode(src);
    if ($isRangeSelection(selection)) {
      selection.insertNodes([imageNode]);
      return;
    }
    $getRoot().append(imageNode);
  });
}

export function replaceImageSrc(editor: LexicalEditor, fromSrc: string, toSrc: string) {
  // Reemplaza src en todas las imagenes que coincidan (preview local -> URL final).
  editor.update(() => {
    const visit = (node: LexicalNode) => {
      if ($isImageNode(node) && node.getSrc() === fromSrc) {
        node.setSrc(toSrc);
      }
      if (node instanceof ElementNode) {
        node.getChildren().forEach(visit);
      }
    };
    visit($getRoot());
  });
}

export function removeImageBySrc(editor: LexicalEditor, targetSrc: string) {
  // Borra imagenes por src. Se usa para limpiar previews cuando falla upload.
  editor.update(() => {
    const visit = (node: LexicalNode) => {
      if ($isImageNode(node) && node.getSrc() === targetSrc) {
        node.remove();
        return;
      }
      if (node instanceof ElementNode) {
        node.getChildren().forEach(visit);
      }
    };
    visit($getRoot());
  });
}

export function insertPlainTextAtSelection(editor: LexicalEditor, text: string) {
  // Fuerza pegado como texto plano para evitar HTML externo inesperado.
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.insertText(text);
      return;
    }
    const paragraph = $createParagraphNode();
    paragraph.append($createTextNode(text));
    $getRoot().append(paragraph);
  });
}

