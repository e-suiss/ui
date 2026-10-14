package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.patterns.TableList
import com.esuiss.ui.patterns.TableListAlign
import com.esuiss.ui.patterns.TableListColumn
import com.esuiss.ui.patterns.TableListFooter
import com.esuiss.ui.patterns.TableListHeader
import com.esuiss.ui.patterns.TableListRow
import com.esuiss.ui.patterns.TableListRowText
import com.esuiss.ui.patterns.TableListSlot

val tableListStories = StoryGroup(
    section = Section.Patterns,
    title = "Table List",
    stories = listOf(
        Story("Default") { TableListDefault() },
        Story("WithFlatList") { TableListWithFlatList() },
    ),
)

private class TableListInvoice(
    val id: String,
    val customer: String,
    val status: String,
    val method: String,
    val amount: String,
)

private val tableListInvoices = listOf(
    TableListInvoice("INV001", "Olivia Martin", "Paid", "Card", "$250.00"),
    TableListInvoice("INV002", "Jackson Lee", "Pending", "PayPal", "$150.00"),
    TableListInvoice("INV003", "Isabella Nguyen", "Unpaid", "Transfer", "$350.00"),
    TableListInvoice("INV004", "William Kim", "Paid", "Card", "$450.00"),
)

private val tableListColumns = listOf(
    TableListColumn<TableListInvoice>("customer", "Customer", slot = TableListSlot.Title) { Text(it.customer, maxLines = 1) },
    TableListColumn<TableListInvoice>("status", "Status", slot = TableListSlot.Description) { Text(it.status, maxLines = 1) },
    TableListColumn<TableListInvoice>("method", "Method", slot = TableListSlot.Description) { Text(it.method, maxLines = 1) },
    TableListColumn<TableListInvoice>("amount", "Amount", slot = TableListSlot.Trailing, align = TableListAlign.End) {
        Text(it.amount, maxLines = 1)
    },
)

@Composable
private fun TableListDefault() {
    Column(verticalArrangement = Arrangement.spacedBy(32.dp)) {
        TableList(
            rows = tableListInvoices,
            columns = tableListColumns,
            getKey = { row, _ -> row.id },
            title = "Invoices",
            onRowClick = {},
        )
        TableList(rows = emptyList(), columns = tableListColumns, emptyText = "No invoices yet.")
    }
}

@Composable
private fun TableListWithFlatList() {
    LazyColumn(Modifier.fillMaxWidth().heightIn(max = 640.dp)) {
        item(key = "header") { TableListHeader("Recent") }
        itemsIndexed(tableListInvoices, key = { _, item -> item.id }) { index, item ->
            TableListRow(first = index == 0, last = index == tableListInvoices.lastIndex, onClick = {}) {
                TableListRowText(item.customer, item.status, item.amount)
            }
        }
        item(key = "footer") { TableListFooter("Payments settle within two days.") }
    }
}
