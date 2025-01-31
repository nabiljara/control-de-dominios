import { DiffTableRow } from "@/components/diff-highlight";
import { TableCell, TableRow } from "@/components/ui/table";
import {  AuditWithRelations,} from "@/db/schema";
import { formatDate } from "@/lib/utils";

export function DomainAuditDetails({ audit }: { audit: AuditWithRelations }) {

  return (
    <>
      {audit.audit_details.map((detail) =>
        detail.field === "Fecha de vencimiento" || detail.field === "Última modificación" || detail.field === "Fecha de creación" ? (
          <TableRow key={detail.id}>
            <TableCell>{detail.field}</TableCell>
            <TableCell>
              {detail.oldValue
                ? formatDate(detail.oldValue)
                : "--"}
            </TableCell>
            <TableCell>
              {formatDate(detail.newValue ? detail.newValue : '--')}
            </TableCell>
          </TableRow>
        ) : (
          <DiffTableRow key={detail.id} detail={detail} />
          // <TableRow key={detail.id}>
          //   <TableCell className="font-medium">{detail.field}</TableCell>
          //   <TableCell>{detail.oldValue}</TableCell>
          //   <TableCell>{detail.newValue}</TableCell>
          // </TableRow>
        )
      )}
    </>
  );
}