# from pdf_annotate import PdfAnnotator, Location, Appearance
# a = PdfAnnotator(r'final_view.pdf')
# a.add_annotation(
#     'square',
#     Location(x1=50, y1=50, x2=100, y2=100, page=0),
#     Appearance(stroke_color=(1, 0, 0), stroke_width=5),
# )
# a.write('b.pdf')  # or use overwrite=True if you feel lucky

# app.py
import io
import base64
import fitz  # PyMuPDF
from PIL import Image
import streamlit as st
from streamlit_drawable-canvas import st_canvas

st.set_page_config(page_title="PDF Viewer & Annotator", layout="wide")
st.title("📄 PDF Viewer & Annotator")

# 1) Load PDF
uploaded = st.sidebar.file_uploader("Upload a PDF", type=["pdf"])
if not uploaded:
    st.sidebar.info("Please upload a PDF file.")
    st.stop()

pdf_bytes = uploaded.read()
pdf = fitz.open(stream=pdf_bytes, filetype="pdf")

# 2) Page selector + zoom
page_num = st.sidebar.number_input(
    "Page", min_value=1, max_value=pdf.page_count, value=1
)
zoom = st.sidebar.slider("Zoom", 1.0, 3.0, 2.0)
page = pdf[page_num - 1]
mat = fitz.Matrix(zoom, zoom)
pix = page.get_pixmap(matrix=mat, alpha=False)
img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

# Convert PIL image to base64 data URI
buf = io.BytesIO()
img.save(buf, format="PNG")
b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
data_uri = f"data:image/png;base64,{b64}"

# 3) Show page image
st.image(img, caption=f"Page {page_num}/{pdf.page_count}", use_container_width=True)

# 4) Draw on it
stroke_width = st.sidebar.slider("Stroke width", 1, 10, 3)
stroke_color = st.sidebar.color_picker("Stroke color", "#FF0000")

canvas_result = st_canvas(
    background_image_url=data_uri,
    stroke_width=stroke_width,
    stroke_color=stroke_color,
    fill_color="rgba(0,0,0,0)",
    height=pix.height,
    width=pix.width,
    drawing_mode="freedraw",
    key=f"canvas_{page_num}",
)

# 5) Save annotations back into the PDF
if st.sidebar.button("💾 Save Annotated PDF"):
    out_pdf = fitz.open(stream=pdf_bytes, filetype="pdf")
    out_page = out_pdf[page_num - 1]

    # Raster overlay (PNG merge)
    if canvas_result.image_data is not None:
        buf2 = io.BytesIO()
        Image.fromarray(canvas_result.image_data.astype("uint8")).save(buf2, format="PNG")
        rect = fitz.Rect(0, 0, out_page.rect.width * zoom, out_page.rect.height * zoom)
        out_page.insert_image(rect, stream=buf2.getvalue(), overlay=True)

    # Vector ink annotations
    if canvas_result.json_data and "objects" in canvas_result.json_data:
        for obj in canvas_result.json_data["objects"]:
            if obj["type"] == "path":
                # Scale points back to PDF coords
                pts = [fitz.Point(pt[0] / zoom, pt[1] / zoom) for pt in obj["path"]]
                ink = out_page.add_annot(
                    fitz.PDF_ANNOT_INK,
                    inklist=[pts],
                )
                # parse strokeColor "#RRGGBB"
                r = int(obj["strokeColor"][1:3], 16) / 255
                g = int(obj["strokeColor"][3:5], 16) / 255
                b = int(obj["strokeColor"][5:7], 16) / 255
                ink.set_colors(stroke={"r": r, "g": g, "b": b})
                ink.set_border(width=obj["strokeWidth"] / zoom)
                ink.update()

    # write out and offer download
    pdf_bytes = out_pdf.write()
    out_pdf.close()

    st.sidebar.download_button(
        "Download Annotated PDF",
        data=pdf_bytes,
        file_name="annotated.pdf",
        mime="application/pdf",
    )
    st.sidebar.success("Your annotated PDF is ready to download!")

st.markdown(
    """
---
**Key changes:**  
- We manually build a Base64 Data‐URI (`background_image_url`) so there’s no reliance on `image_to_url`.  
- We’ve kept both raster merging and true vector‐ink annotation options—just choose the one you prefer (or keep both).  
- Swapped back to `use_container_width=True` for `st.image()`.  
"""
)
