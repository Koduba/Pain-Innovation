import jsPDF from 'jspdf'
import { SurveyData } from '@/types/survey'

export class PDFGenerator {
  static generateSurveyPDF(surveyData: SurveyData): void {
    const pdf = new jsPDF()
    
    // Set up fonts and colors
    pdf.setFont('helvetica')
    pdf.setFontSize(16)
    
    // Title
    pdf.text('Delphi Survey Response', 105, 20, { align: 'center' })
    
    // Respondent Information
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Respondent Information:', 20, 40)
    pdf.setFont('helvetica', 'normal')
    
    let yPosition = 50
    pdf.text(`Name: ${surveyData.respondent.name}`, 30, yPosition)
    yPosition += 8
    pdf.text(`Institution: ${surveyData.respondent.institution}`, 30, yPosition)
    yPosition += 8
    pdf.text(`Role: ${surveyData.respondent.role}`, 30, yPosition)
    yPosition += 8
    pdf.text(`Date: ${surveyData.respondent.date}`, 30, yPosition)
    
    // General Comments
    yPosition += 15
    pdf.setFont('helvetica', 'bold')
    pdf.text('General Comments:', 20, yPosition)
    yPosition += 10
    pdf.setFont('helvetica', 'normal')
    
    // Handle long comments with word wrap
    const comments = surveyData.general_comments || 'No comments provided'
    const splitComments = pdf.splitTextToSize(comments, 170)
    pdf.text(splitComments, 30, yPosition)
    yPosition += splitComments.length * 6 + 10
    
    // Survey Responses by Section
    pdf.setFont('helvetica', 'bold')
    pdf.text('Survey Responses:', 20, yPosition)
    yPosition += 15
    
    // Process each section
    Object.entries(surveyData.responses).forEach(([sectionKey, section]) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = 20
      }
      
      // Section title
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.text(section.title, 20, yPosition)
      yPosition += 10
      
      // Section description (if available)
      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(9)
      // Note: desc property may not be available in SurveyData type
      pdf.text('', 25, yPosition)
      yPosition += 10
      
      // Questions and responses
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      
      section.items.forEach((item, index) => {
        // Check if we need a new page
        if (yPosition > 260) {
          pdf.addPage()
          yPosition = 20
        }
        
        // Question number and text
        const questionText = `Q${item.question_number}: ${item.statement}`
        const splitQuestion = pdf.splitTextToSize(questionText, 170)
        pdf.text(splitQuestion, 25, yPosition)
        yPosition += splitQuestion.length * 5 + 5
        
        // Rating and comment
        const ratingText = `Rating: ${item.rating === 'N/A' ? 'N/A' : item.rating}/7`
        pdf.text(ratingText, 30, yPosition)
        yPosition += 6
        
        if (item.comment && item.comment.trim()) {
          const commentText = `Comment: ${item.comment}`
          const splitComment = pdf.splitTextToSize(commentText, 165)
          pdf.text(splitComment, 30, yPosition)
          yPosition += splitComment.length * 5 + 5
        }
        
        yPosition += 5 // Add spacing between questions
      })
      
      yPosition += 10 // Add spacing between sections
    })
    
    // Summary Statistics
    if (yPosition > 240) {
      pdf.addPage()
      yPosition = 20
    }
    
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.text('Summary Statistics:', 20, yPosition)
    yPosition += 15
    
    // Calculate statistics
    const allItems = Object.values(surveyData.responses).flatMap(section => section.items)
    const numericRatings = allItems
      .filter(item => typeof item.rating === 'number')
      .map(item => item.rating as number)
    
    const average = numericRatings.length > 0 
      ? (numericRatings.reduce((sum, rating) => sum + rating, 0) / numericRatings.length).toFixed(1)
      : 'N/A'
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.text(`Total Questions: ${allItems.length}`, 30, yPosition)
    yPosition += 8
    pdf.text(`Answered: ${numericRatings.length}`, 30, yPosition)
    yPosition += 8
    pdf.text(`Skipped: ${allItems.length - numericRatings.length}`, 30, yPosition)
    yPosition += 8
    pdf.text(`Average Rating: ${average}/5`, 30, yPosition)
    
    // Footer
    const pageCount = pdf.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(8)
      pdf.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' })
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 290, { align: 'center' })
    }
    
    // Download the PDF
    const fileName = `delphi_survey_${surveyData.respondent.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  }
  
  static async generatePDFWithImages(surveyData: SurveyData): Promise<void> {
    // This could be extended to include charts/graphs in the future
    this.generateSurveyPDF(surveyData)
  }
}
